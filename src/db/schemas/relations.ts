import { relations } from "drizzle-orm";
import { subscription, user } from "./auth";
import { usage } from "./plan";

export const subscriptionRelations = relations(subscription, ({one, many}) => ({
    user: one(user, {
        fields: [subscription.referenceId],
        references: [user.id]
    }),
    usages: many(usage)
}))

export const usageRelations = relations(usage, ({one}) => ({
    subscription: one(subscription, {
        fields: [usage.subscriptionId],
        references: [subscription.id]
    })
}))