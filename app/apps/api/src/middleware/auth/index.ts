import { auth } from "@/lib/auth"
import { createMiddleware } from "hono/factory"
import { HTTPException } from 'hono/http-exception'
import { UserWithRole } from "better-auth/plugins"
import { Session } from "better-auth/types"
import { ApplicationRoles, rankApplicationRoles } from "@packages/core/permissions"

export const attachAuth = createMiddleware(async (ctx, next) => {
  const session = await auth.api.getSession({headers: ctx.req.raw.headers})

  if (!session) {
    ctx.set("user", null)
    ctx.set("session", null)
    await next()
    return
  }

  ctx.set("user", session.user as UserWithRole & {role: ApplicationRoles})
  ctx.set("session", session.session as Session)
  await next()
})

export const requireAuth = createMiddleware(async (ctx, next) => {
  const session = ctx.get("session")
  const user = ctx.get("user")

  if (!session || !user) {
    throw new HTTPException(401, { 
      message: "Unauthorized access",
      cause: "Missing or invalid cookies session"
    })
  }

  await next()  
})

export const requirePermission = (role: ApplicationRoles) => {
  return createMiddleware(async (ctx, next) => {
    const user = ctx.get("user")

    if (!user) {
      throw new HTTPException(401, { 
        message: "Unauthorized access",
        cause: "Missing or invalid cookies session"
      })
    }
    
    if (!rankApplicationRoles(user.role as ApplicationRoles, role, true)) throw new HTTPException(403, { 
      message: "Invalid permissions", 
      cause: "User does not proper role for route"
    })

    await next()
  })
}