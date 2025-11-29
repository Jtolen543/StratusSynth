import { db } from "@/lib/db";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export const attachTenant = createMiddleware(async (ctx, next) => {
  const user = ctx.get("user")

  if (!user) throw new HTTPException(401, {
    cause: "Invalid access permissions",
    message: "Unauthorized access to cloud services",
  })

  const tenantData = await db.query.tenant.findFirst({
    where: (tenant, {eq}) => eq(tenant.userId, user.id)
  })

  if (!tenantData) throw new HTTPException(404, {
    cause: "Tenant not found",
    message: "User does not have tenancy in application"
  })

  ctx.set("tenant", tenantData.id)
  await next()
})