import { 
    integer,
    pgTable,
    text,
    timestamp,
    uuid 
} from "drizzle-orm/pg-core"
import { tenant } from "./tenant"
import { sql } from "drizzle-orm"

export const bucket = pgTable("bucket", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenant.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    uri: text("uri").notNull(),
    location: text("location").notNull(),
    locationType: text("location_type").notNull(),
    storageClass: text("storage_class").notNull(),
    createdAt: timestamp("created_at", {withTimezone: true}).defaultNow(),
    updatedAt: timestamp("updated_at", {withTimezone: true}).defaultNow().$onUpdate(() => sql`now()`),
    size: integer("size")
})