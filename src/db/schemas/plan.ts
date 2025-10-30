import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey
} from "drizzle-orm/pg-core";
import { subscription, user } from "./auth";

export const usage = pgTable("usage", {
  referenceId: text("reference_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  metric: text("metric").notNull(),             
  subscriptionId: text("subscription_id").notNull().references(() => subscription.id, {onUpdate: "cascade", onDelete: "cascade"}),
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => [primaryKey({ columns: [t.metric, t.referenceId] })]);