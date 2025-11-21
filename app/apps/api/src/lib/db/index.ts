import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless"
import { tables } from "@packages/core/db/schemas";

const instance = neon(process.env.DATABASE_URL as string)
export const db = drizzle(instance, { schema: tables })
