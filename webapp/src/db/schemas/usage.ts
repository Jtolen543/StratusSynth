import {
  pgTable,
  text,
  timestamp,
  integer,
  primaryKey
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const usage = pgTable("usage", {
  referenceId: text("reference_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  periodStart: timestamp("period_start").notNull(),
  periodEnd: timestamp("period_end").notNull(),
  metric: text("metric").notNull(),             
  count: integer("count").notNull().default(0),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
}, (t) => [primaryKey({ columns: [t.metric, t.referenceId] })]);