import { 
    pgTable,
    text,
    uuid 
} from "drizzle-orm/pg-core"
import { user } from "./auth"

export const tenant = pgTable("tenant", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    providerId: text("provider_id").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
})