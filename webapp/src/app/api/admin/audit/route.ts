import { db } from "@/db";
import { auditLogs } from "@/db/schemas/audit";
import { desc, ilike, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export type AuditLogGetResponse = {
  data: typeof auditLogs.$inferSelect[],
  totalLogs: number
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams

  const offset = searchParams.get("offset")
  const limit = searchParams.get("limit")
  const search = searchParams.get("search")

  let subquery = db.select().from(auditLogs).$dynamic()
  const original = await subquery.execute()
  
  if (offset) subquery = subquery.offset(parseInt(offset, 0))
  if (limit) subquery = subquery.limit(parseInt(limit, 10))
  if (search) subquery = subquery.where(or(ilike(auditLogs.event, `%${search}%`), ilike(auditLogs.description, `%${search}%`), ilike(auditLogs.detail, `%${search}%`)))

  subquery = subquery.orderBy(desc(auditLogs.createdAt))

  const body: AuditLogGetResponse = {data: await subquery.execute(), totalLogs: original.length}
  return NextResponse.json(body)
}