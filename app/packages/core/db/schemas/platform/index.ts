import * as storageTables from "./storage"
import * as tenantTables from "./tenant"

export const platformTables = {
    ...storageTables,
    ...tenantTables
}