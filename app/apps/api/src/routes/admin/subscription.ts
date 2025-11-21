import { Hono } from "hono";
import { ExtendedSubscription } from "@packages/types/subscription"
import { isUpgrade, planToPriceMap, priceToPlanMap, stripeClient } from "@/lib/stripe";

async function getSubAndItem(subscriptionId: string, idempotencyKey: string) {
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data.price.product", "latest_invoice.payment_intent"]
    }, {idempotencyKey})
    const item = subscription.items.data[0]    
    return {subscription, item}
}

export const adminSubscriptionRoute = new Hono()

adminSubscriptionRoute.post("/", async(ctx) => {
    const body: ExtendedSubscription = await ctx.req.json()
    const idempotencyKey = ctx.req.raw.headers.get("x-idempotency-key") ?? crypto.randomUUID();

    if (!body.stripeSubscriptionId) return ctx.json({message: "Must have valid subscription ID for operations", success: false, id: body.referenceId})

    try {
        if (body.action === "modify" && body.stripeSubscriptionId) {
            if (body.plan === "free") {
                await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                    cancel_at_period_end: true
                }, {idempotencyKey})
            } else {
                const { item } = await getSubAndItem(body.stripeSubscriptionId, idempotencyKey)
                if (isUpgrade(priceToPlanMap[item.price.id], body.plan)) {
                    await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                        items: [{id: item.id, plan: planToPriceMap[body.plan]}]
                    }, {idempotencyKey})
                } else {
                    await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                        items: [{id: item.id, price: planToPriceMap[body.plan]}],
                    })
                }
            }
        } else if (body.action === "remove-cancellation" && body.stripeSubscriptionId) {
            await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                cancel_at_period_end: false
            }, {idempotencyKey})
        } else if (body.action === "set-cancellation" && body.stripeSubscriptionId) {
            if (body.detail === "now") {
                await stripeClient.subscriptions.cancel(body.stripeSubscriptionId, {idempotencyKey})
            } else if (body.detail === "cycle") {
                await stripeClient.subscriptions.update(body.stripeSubscriptionId, {
                    cancel_at_period_end: true
                }, {idempotencyKey})
            }
        } else if (body.action === "seats") {

        }
        return ctx.json({message: "Successfully handled action", success: true, id: body.referenceId})
    } catch (e) {
        console.log(e)
        throw new Error("Failed to process action")
    }
})

