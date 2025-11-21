import * as authTables from "./auth"
import * as planTables from "./usage"
import * as auditTables from "./audit"
import * as relationSchemas from "./relations"

// Drizzle adapters expect a map of tables only; relations are exported separately.
export const schemaTables = {
    ...authTables,
    ...planTables,
    ...auditTables,
    ...relationSchemas
}
