import { relations } from "drizzle-orm";
import { subscription, user } from "./auth";
import { usage } from "./usage";
import { tenant } from "./platform/tenant";
import { bucket } from "./platform/storage";

// API Relations

export const userRelations = relations(user, ({ many, one }) => ({
    usage: many(usage),
    subscription: many(subscription),
    tenant: one(tenant)
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

// Infrastructural Relations

export const tenantRelations = relations(tenant, ({ one, many }) => ({
    user: one(user, {
        fields: [tenant.userId],
        references: [user.id]
    }),
    bucket: many(bucket)
}))

export const bucketRelations = relations(bucket, ({ one }) => ({
    tenant: one(tenant, {
        fields: [bucket.tenantId],
        references: [tenant.id]
    })
}))