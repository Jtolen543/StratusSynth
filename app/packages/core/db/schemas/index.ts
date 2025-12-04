import * as authTables from "./auth"
import * as planTables from "./usage"
import * as auditTables from "./audit"
import * as platformTables from "./platform"
import * as relationSchemas from "./relations"

export const schemaTables = {
    ...authTables,
    ...planTables,
    ...auditTables,
    ...platformTables,
    ...relationSchemas
}
