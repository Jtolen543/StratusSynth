import * as authTables from "./auth"
import * as planTables from "./usage"
import * as auditTables from "./audit"
import * as relationSchemas from "./relations"

export const schemaTables = {
    ...authTables,
    ...planTables,
    ...relationSchemas,
    ...auditTables
}