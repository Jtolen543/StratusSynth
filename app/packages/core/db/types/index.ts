import { drizzle } from "drizzle-orm/neon-http";
import { schemaTables } from "@packages/core/db/schemas";

export type DrizzleInstance = ReturnType<typeof drizzle<typeof schemaTables>>