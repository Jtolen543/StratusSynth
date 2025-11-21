import Stripe from "stripe";
import { db } from "@/lib/db"
import { usage } from "@packages/core/db/schemas/usage";
import { and, eq, inArray } from "drizzle-orm";
import { stripeClient } from "@/lib/stripe"
import { cyclableMetrics } from "@packages/core/pricing";

function hasCycled(prevSub: Partial<Stripe.Subscription>, currSub: Stripe.Subscription) {
    const prev = prevSub?.items?.data.sort((a, b) => a.id.localeCompare(b.id)) ?? []
    const curr = currSub.items.data.sort((a, b) => a.id.localeCompare(b.id))

    if (prev.length !== curr.length) return false;

    for (let i = 0; i < prev.length; i++) {
        const a = prev[i];
        const b = curr[i];
        if (a.id !== b.id || a.price.id !== b.price.id) return false
        if (a.current_period_end !== b.current_period_start || a.current_period_start === b.current_period_start) return false
    }   
    return true
}

export async function stripeEventHandler(event: Stripe.Event) {
    const idempotencyKey = crypto.randomUUID()

    try {
        switch (event.type) {
            case "customer.subscription.updated": {
                const prevObject = event.data.previous_attributes
                const currObject = event.data.object

                if (prevObject?.latest_invoice && prevObject.items && hasCycled(prevObject, currObject)) {
                    const subscriptionData = await db.query.subscription.findFirst({
                        where: (subscription, {eq}) => and(eq(subscription.stripeSubscriptionId, currObject.id), eq(subscription.status, "active")),
                        with: {
                            user: true
                        }
                    })
                    const user = subscriptionData?.user

                    if (!user) throw new Error("Failed to update cycle")

                    await db.update(usage).set({
                        updatedAt: new Date(),
                        count: 0
                    }).where(and(eq(usage.referenceId, user.id), inArray(usage.metric, cyclableMetrics)))
                }
                console.log(`Processed webhook: ${event.type}`)
                break
            }
            case "checkout.session.completed": {
                const checkoutObject = event.data.object
                
                if (checkoutObject.mode === "subscription" && checkoutObject.customer && checkoutObject.subscription) {
                    const currentSession = await stripeClient.checkout.sessions.retrieve(checkoutObject.id,  {
                        expand: ["subscription.latest_invoice.confirmation_secret", "customer"]
                    }, {idempotencyKey})
                    const customer = currentSession.customer as Stripe.Customer

                    if (!customer.invoice_settings.default_payment_method) {
                        const subscription = currentSession.subscription as Stripe.Subscription
                        const invoice = subscription.latest_invoice as Stripe.Invoice
                        const clientSecret = invoice.confirmation_secret?.client_secret
                        const paymentIntentId = clientSecret?.split("_secret_")[0]

                        if (paymentIntentId) {
                            const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId)
                            await stripeClient.customers.update(checkoutObject.customer.toString(), {
                                invoice_settings: {default_payment_method: paymentIntent.payment_method?.toString()}
                            }, {idempotencyKey})
                        }
                    }
                }
                console.log(`Processed webhook: ${event.type}`)
                break
            }
            default:
                console.log("Could not match webhook type: ", event.type)
                break
        }
    } catch (error: unknown) {
        if (error instanceof Stripe.errors.StripeCardError) {
            console.error("[stripe] Card error", {
                code: error.code,
                message: error.message,
                status: error.statusCode,
                type: error.type,
            })
        } else if (error instanceof Stripe.errors.StripeInvalidRequestError) {
            console.error("[stripe] Invalid request", {
                code: error.code,
                message: error.message,
                param: error.param,
                requestId: error.requestId,
                status: error.statusCode,
            })
        } else if (error instanceof Stripe.errors.StripeAPIError) {
            console.error("[stripe] API error", {
                message: error.message,
                requestId: error.requestId,
                status: error.statusCode,
            })
        } else if (error instanceof Stripe.errors.StripeError) {
            console.error("[stripe] General Stripe error", {
                type: error.type,
                message: error.message,
                requestId: error.requestId,
                status: error.statusCode,
            })
        } else if (error instanceof Error) {
            console.error("[stripe] Unexpected error", {
                name: error.name,
                message: error.message,
                stack: error.stack,
            })
        } else {
            console.error("[stripe] Unknown error", error)
        }
        throw error
    }
}