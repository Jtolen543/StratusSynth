import { 
    date,
    integer,
    pgTable,
    text,
    uuid 
} from "drizzle-orm/pg-core"
import { tenant } from "./tenant"

export const bucket = pgTable("bucket", {
    id: uuid("id").primaryKey().defaultRandom(),
    tenantId: uuid("tenant_id").notNull().references(() => tenant.id, {onDelete: "cascade"}),
    name: text("name").notNull(),
    uri: text("uri").notNull(),
    location: text("location").notNull(),
    locationType: text("location_type").notNull(),
    storageClass: text("storage_class").notNull(),
    createdAt: date("created_at").defaultNow(),
    updatedAt: date("updated_at").$onUpdate(() => String(new Date())),
    size: integer("size")
})