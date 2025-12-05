import { relations } from "drizzle-orm";
import { tenant } from "../tenant";
import { bucket } from "../bucket";
import { user } from "../auth";

export const tenantRelations = relations(tenant, ({ one, many }) => ({
  user: one(user, {
    fields: [tenant.userId],
    references: [user.id],
  }),
  bucket: many(bucket),
}));

export const bucketRelations = relations(bucket, ({ one }) => ({
  tenant: one(tenant, {
    fields: [bucket.tenantId],
    references: [tenant.id],
  }),
}));
