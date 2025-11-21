import { Hono } from "hono";
import { db } from "@/lib/db";
import { auditLogs } from "@packages/core/db/schemas/audit";
import { desc, eq, ilike, or } from "drizzle-orm";
import { AuditLogGetResponse, AuditLogDeleteResponse } from "@packages/audit";
import { rankApplicationRoles } from "@packages/core/permissions";
import { HTTPException } from "hono/http-exception";

export const adminAuditRoute = new Hono()

adminAuditRoute.get("/", async (ctx) => {
  const queryParams = ctx.req.query()

  const { offset, search, limit } = queryParams

  let subquery = db.select().from(auditLogs).$dynamic()
  const original = await subquery.execute()
  
  if (offset) subquery = subquery.offset(parseInt(offset, 0))
  if (limit) subquery = subquery.limit(parseInt(limit, 10))
  if (search) subquery = subquery.where(or(ilike(auditLogs.event, `%${search}%`), ilike(auditLogs.description, `%${search}%`), ilike(auditLogs.detail, `%${search}%`)))

  subquery = subquery.orderBy(desc(auditLogs.createdAt))

  const body: AuditLogGetResponse = {data: await subquery.execute(), totalLogs: original.length}
  return ctx.json(body)
})

adminAuditRoute.delete("/", async (ctx) => {
  const user = ctx.get("user")!

  if (!rankApplicationRoles(user.role, "admin", true)) throw new HTTPException(403, {
    message: "Must be at least an admin to delete all audit logs",
    cause: "Invalid permissions",
  })

  const queryParams = ctx.req.query()
  const { id } = queryParams

  let data: AuditLogDeleteResponse;

  if (!id) {
    await db.delete(auditLogs)
    data = {id, message: "Successfully deleted all logs from website"}
  } else {
    await db.delete(auditLogs).where(eq(auditLogs.id, id))
    data = {id, message: `Successfully deleted log with ID: ${id}`}
  }

  return ctx.json(data)
})