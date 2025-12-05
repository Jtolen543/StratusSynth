import * as authTables from "./auth"
import * as planTables from "./usage"
import * as auditTables from "./audit"
import * as storageTables from "./bucket"
import * as tenantTables from "./tenant"
import * as relationSchemas from "./relations"

export const schemaTables = {
    ...authTables,
    ...planTables,
    ...auditTables,
    ...storageTables,
    ...tenantTables,
    ...relationSchemas
}
