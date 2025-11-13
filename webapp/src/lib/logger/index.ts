import { db } from "@/db"
import { auditLogs } from "@/db/schemas/audit"
import { getSessionInfo } from "@/utils/format"
import { GenericEndpointContext } from "better-auth"
import Stripe from "stripe"
import { session, user } from "@/db/schemas/auth"
import { desc, eq, or  } from "drizzle-orm"
import { auth } from "../authentication/auth"

export type AuditLogProps = {
  event: string
  description: string
  detail: string
  status: "SUCCESS" | "FAILED"
  source: string
  referenceId?: string
  sessionId?: string
  device?: string
  system?: string
  browser?: string
  email?: string
}

export type EventPayloadProps = {
  event: string
  description: string
  detail: string
  status: "SUCCESS" | "FAILED"
}

async function getUserMetadata(referenceId: string | undefined) {
  if (!referenceId) return {}
   
  const res = await db.select().from(session)
  .innerJoin(user, or(eq(user.id, session.userId), eq(user.email, referenceId)))
  .where(eq(user.id, referenceId))
  .orderBy(desc(session.createdAt))
  .limit(1)

  if (res.length === 0) return {}

  const data = res[0]
  const {browser, system, device} = getSessionInfo(data.session.userAgent)
  
  return {email: data.user.email, referenceId: data.user.id, sessionId: data.session.id, browser, system, device}
}

export async function createBetterAuthAudit(ctx: GenericEndpointContext, eventData: EventPayloadProps, userId?: string) {
  const source = new URL(ctx.request?.url ?? "").pathname
  const currentSession = await auth.api.getSession({headers: ctx.request?.headers!})

  let data;

  if (currentSession) {
    const {browser, system, device} = getSessionInfo(currentSession.session.userAgent)
    data = {browser, system, device, email: currentSession.user.email, referenceId: currentSession.user.id, sessionId: currentSession.session.id}
  } else data = await getUserMetadata(userId)

  const {browser, system, device} = getSessionInfo(ctx.request?.headers.get("user-agent"))

  const payload = {...data, source, browser, system, device, ...eventData}
  await sendAuditLog(payload)
}

export async function createRequestAudit(request: Request, eventData: EventPayloadProps, userId?: string) {
  const source = new URL(request.url ?? "").pathname
  const currentSession = await auth.api.getSession({ headers: request.headers })

  let data;

  if (currentSession) {
    const {browser, system, device} = getSessionInfo(currentSession.session.userAgent)
    data = {browser, system, device, email: currentSession.user.email, referenceId: currentSession.user.id, sessionId: currentSession.session.id}
  } else data = await getUserMetadata(userId)

  const {browser, system, device} = getSessionInfo(request.headers.get("user-agent"))

  const payload = {...data, source, browser, system, device, ...eventData}
  await sendAuditLog(payload)
}

export async function createStripeEventAudit(event: Stripe.Event, eventData: EventPayloadProps, referenceId?: string) {
  const source = event.type
  const data = await getUserMetadata(referenceId)

  const payload = {...data, source, ...eventData}
  await sendAuditLog(payload)
}

async function sendAuditLog({event, description, detail, status, source, referenceId, sessionId, device, system, browser, email}: AuditLogProps) {
  await db.insert(auditLogs).values({
    event: event,
    description: description,
    detail: detail,
    status: status,
    source: source,
    referenceId: referenceId,
    sessionId: sessionId,
    device: device,
    system: system,
    browser: browser,
    email: email
  })
  console.log("Successfully logged information to database")
}