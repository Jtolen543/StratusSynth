import { 
    pgEnum,
    pgTable,
    text,
    uuid 
} from "drizzle-orm/pg-core"
import { user } from "./auth"

const providerEnums = pgEnum("provider", ["gcp", "aws", "azure"])

export const tenant = pgTable("tenant", {
    id: uuid("id").primaryKey().defaultRandom(),
    provider: providerEnums("provider").notNull(),
    userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" })
})