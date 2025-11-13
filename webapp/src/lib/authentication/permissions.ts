import { createAccessControl, Statements } from "better-auth/plugins/access";
import { defaultStatements, adminAc, userAc } from "better-auth/plugins/admin/access";

type ProjectActions = "create" | "update" | "delete" | "read" | "share"
type ApplicationActions = "modify" | "audit" | "transfer" | "delete" | "create" | "billing" | "domains" | "data" | "backup"

interface CustomStatements extends Statements {
    project: ProjectActions[]
    site: ApplicationActions[]
}

export const statements: CustomStatements = {
    ...defaultStatements,
    project: ["create", "update", "delete", "read", "share"],
    site: ["audit", "create", "delete", "transfer", "modify", "billing", "domains", "data", "backup"]
}

export type ApplicationRoles = "user" | "moderator" | "admin" | "owner"

const rankMap = {
    user: 1,
    moderator: 2,
    admin: 3,
    owner: 4
}
const rolesArray: ApplicationRoles[] = ["user", "moderator", "admin", "owner"]

interface RoleOption {
  key: ApplicationRoles;
  value: string;
}

export function rankApplicationRoles(
  currentRole: ApplicationRoles,
  targetRole: ApplicationRoles
): boolean;

export function rankApplicationRoles(
  currentRole: ApplicationRoles
): RoleOption[];

/**
 * 
 * @param currentRole Role assigned to current user in session
 * @param targetRole Optional parameter where role assigned to user that's being compared to current session
 * @returns If targetRole is provided, returns true if currentRole has greater status than targetRole, else false. 
 * If not provided, returns array of {key, val} where key is the user current session can modify and value is the formated name
 */

export function rankApplicationRoles(currentRole: ApplicationRoles, targetRole?: ApplicationRoles) {
    if (targetRole) {
        return rankMap[currentRole] > rankMap[targetRole]
    } else {
        const res = rolesArray.filter((obj) => rankMap[obj] < rankMap[currentRole])
        .map((obj) => ({key: obj, value: obj.charAt(0).toLocaleUpperCase() + obj.slice(1).toLocaleLowerCase()}))
        .sort((a, b) => rankMap[a.key] - rankMap[b.key])
        return res
    }
}
export const accessControl = createAccessControl(statements)

export const userRole = accessControl.newRole({
    ...userAc.statements,
    project: ["read"],
    site: []
})

export const moderatorRole = accessControl.newRole({
    ...userRole.statements,
    user: ["update", "list", "set-password", "impersonate", "ban", "get"],
    project: ["read", "update", "share"],
    session: ["revoke", "list", "delete"]
})

export const adminRole = accessControl.newRole({
    ...moderatorRole.statements,
    project: ["create", "update", "delete", "read", "share"],
    site: ["audit"]
})

export const ownerRole = accessControl.newRole({
    ...adminRole.statements,
    site: ["audit", "create", "delete", "modify", "transfer"]
})