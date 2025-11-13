import { NextRequest, NextResponse } from "next/server";
import { stripeClient } from "@/lib/authentication/auth";
import { Subscription } from "@better-auth/stripe";
import { ActionTypes } from "@/app/(admin)/admin/users/ManageSubscription";
import { PlanProps, isUpgrade, planToPriceMap, priceToPlanMap } from "@/lib/stripe";

type ExtendedSubscription = Subscription & {
    detail?: string
    action?: ActionTypes
    months?: number
    seats?: number
    plan?: PlanProps
}

async function getSubAndItem(subscriptionId: string, idempotencyKey: string) {
    const subscription = await stripeClient.subscriptions.retrieve(subscriptionId, {
        expand: ["items.data.price.product", "latest_invoice.payment_intent"]
    }, {idempotencyKey})
    const item = subscription.items.data[0]    
    return {subscription, item}
}

export async function POST(request: NextRequest) {
    const body: ExtendedSubscription = await request.json()
    const idempotencyKey = request.headers.get("x-idempotency-key") ?? crypto.randomUUID();

    if (!body.stripeSubscriptionId) return NextResponse.json({message: "Must have valid subscription ID for operations", success: false, id: body.referenceId})

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
                    // const sub = await stripeClient.subscriptions.retrieve(body.stripeSubscriptionId, {idempotencyKey})
                    // const start = sub.start_date
                    // const end = sub.cancel_at as number
                    // const now = Math.floor(Date.now() / 1000)

                    // const totalSecs = end - start;
                    // const remainingSecs = end - now;
                    // const remainingRatio = remainingSecs / totalSecs;
                    
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
        return NextResponse.json({message: "Successfully handled action", success: true, id: body.referenceId})
    } catch (e) {
        console.log(e)
        throw new Error("Failed to process action")
    }
}