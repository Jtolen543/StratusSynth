import {
  pgTable,
  text,
  uuid,
  timestamp
} from "drizzle-orm/pg-core";

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  event: text("event").notNull(),
  detail: text("detail").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull(),
  source: text("source").notNull(),
  referenceId: text("reference_id"),
  sessionId: text("session_id"),
  device: text("device"),
  browser: text("browser"),
  system: text("system"),
  email: text("email"),
  createdAt: timestamp("created_at").defaultNow()
})