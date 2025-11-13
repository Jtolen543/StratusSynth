import { relations } from "drizzle-orm";
import { subscription, user } from "./auth";
import { usage } from "./usage";

export const userRelations = relations(user, ({ many }) => ({
    usage: many(usage),
    subscription: many(subscription)
}))

export const subscriptionRelations = relations(subscription, ({ one }) => ({
    user: one(user, {
        fields: [subscription.referenceId],
        references: [user.id]
    })
}))

export const usageRelations = relations(usage, ({one}) => ({
    user: one(user, {
        fields: [usage.referenceId],
        references: [user.id]
    })
}))