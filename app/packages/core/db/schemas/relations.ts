import { relations } from "drizzle-orm";
import { subscription, user } from "./auth";
import { usage } from "./usage";
import { tenant } from "./tenant";

export const userRelations = relations(user, ({ many, one }) => ({
    usage: many(usage),
    subscription: many(subscription),
    tenant: one(tenant)
}))

export const tenantRelations = relations(tenant, ({ one }) => ({
    user: one(user, {
        fields: [tenant.userId],
        references: [user.id]
    })
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