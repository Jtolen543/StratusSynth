import Stripe from "stripe";
import { db } from "@/db";
import { usage } from "@/db/schemas/plan";
import { eq } from "drizzle-orm";
import { subscription } from "@/db/schemas/auth";
import { addMonthsUTC, nowUTC } from "../cron/date";

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
    switch (event.type) {
        case "customer.subscription.updated":
            
            const prevObject = event.data.previous_attributes
            const currObject = event.data.object

            if (prevObject?.latest_invoice && prevObject.items && hasCycled(prevObject, currObject)) {
                const subscriptionData = await db.query.subscription.findFirst({
                    where: (subscription, {eq}) => eq(subscription.stripeSubscriptionId, currObject.id),
                    with: {
                        usages: true
                    }
                })
                const usageData = subscriptionData?.usages ?? []
                async function updateUsage(subscriptionId: string) {
                    return db.update(usage).set({
                        updatedAt: new Date(),
                        count: 0
                    }).where(eq(usage.subscriptionId, subscriptionId))
                }
                await Promise.all(usageData.map((data) => updateUsage(data.subscriptionId)))
                console.log(`Reset usages for user: ${subscriptionData?.referenceId}`)

            }
            break
        case "customer.subscription.deleted":
            event.data.object.id
            const periodStart = nowUTC()
            const periodEnd = addMonthsUTC(periodStart, 1)
            await Promise.all([
                db.update(subscription).set({
                    plan: "basic",
                    status: "active",
                    periodStart,
                    stripeSubscriptionId: null,
                    periodEnd
                }).where(eq(subscription.id, event.data.object.id)),
                db.update(usage).set({
                    count: 0
                }).where (eq(usage.subscriptionId, event.data.object.id))
            ])
        default:
            console.log("Could not match webhook: ", event.type)
            break
    }
}