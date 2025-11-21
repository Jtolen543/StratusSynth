import * as authTables from "./auth"
import * as planTables from "./usage"
import * as auditTables from "./audit"
import * as relationSchemas from "./relations"

// Drizzle adapters expect a map of tables only; relations are exported separately.
export const tables = {
    ...authTables,
    ...planTables,
    ...auditTables,
}

export const relations = {
    ...relationSchemas,
}

// Backcompat export; prefer `tables`.
export const schemaTables = tables
