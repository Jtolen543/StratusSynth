import { ApplicationRoles } from "@packages/core/permissions"
import { Session } from "better-auth"
import { UserWithRole } from "better-auth/plugins"

declare module "hono" {
  interface ContextVariableMap {
    session: Session | null
    user: UserWithRole & {role: ApplicationRoles} | null
    serviceKey: string
  }
}
