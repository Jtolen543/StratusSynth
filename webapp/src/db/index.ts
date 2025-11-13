import { drizzle } from "drizzle-orm/neon-http";
import { schemaTables } from "./schemas";

export const db = drizzle(process.env.DATABASE_URL as string, {
    schema: schemaTables
})