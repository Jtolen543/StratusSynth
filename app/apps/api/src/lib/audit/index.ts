import { db } from "@/lib/db"
import { session, user } from "@packages/core/db/schemas/auth";
import { desc, eq, or } from "drizzle-orm";
import { getSessionInfo } from "@packages/utils/format";
import { auth } from "@/lib/auth";
import Stripe from "stripe";
import type { GenericEndpointContext } from "better-auth";
import { writeAuditLog, type AuditLogProps, type AuditEventPayload, type AuditContextPayload } from "@packages/audit";

async function getUserMetadata(referenceId: string | undefined): Promise<Partial<AuditContextPayload>> {
  if (!referenceId) return {};

  const res = await db
    .select()
    .from(session)
    .innerJoin(
      user,
      or(eq(user.id, session.userId), eq(user.email, referenceId))
    )
    .where(eq(user.id, referenceId))
    .orderBy(desc(session.createdAt))
    .limit(1);

  if (res.length === 0) return {};

  const data = res[0];
  const { browser, system, device } = getSessionInfo(data.session.userAgent);

  return {
    email: data.user.email,
    referenceId: data.user.id,
    sessionId: data.session.id,
    browser,
    system,
    device,
  };
}

async function buildContextFromBetterAuth(ctx: GenericEndpointContext, userId?: string): Promise<AuditContextPayload> {
  const source = new URL(ctx.request?.url ?? "").pathname;

  const currentSession = await auth.api.getSession({
    headers: ctx.request?.headers!,
  });

  let base: Partial<AuditContextPayload>;

  if (currentSession) {
    const { browser, system, device } = getSessionInfo(
      currentSession.session.userAgent
    );
    base = {
      browser,
      system,
      device,
      email: currentSession.user.email,
      referenceId: currentSession.user.id,
      sessionId: currentSession.session.id,
    };
  } else {
    base = await getUserMetadata(userId);
  }

  const { browser, system, device } = getSessionInfo(
    ctx.request?.headers.get("user-agent")
  );

  return {
    ...base,
    source,
    browser,
    system,
    device,
  };
}

async function buildContextFromRequest(request: Request, userId?: string ): Promise<AuditContextPayload> {
  const source = new URL(request.url ?? "").pathname;

  const currentSession = await auth.api.getSession({ headers: request.headers });

  let base: Partial<AuditContextPayload>;

  if (currentSession) {
    const { browser, system, device } = getSessionInfo(
      currentSession.session.userAgent
    );
    base = {
      browser,
      system,
      device,
      email: currentSession.user.email,
      referenceId: currentSession.user.id,
      sessionId: currentSession.session.id,
    };
  } else {
    base = await getUserMetadata(userId);
  }

  const { browser, system, device } = getSessionInfo(
    request.headers.get("user-agent")
  );

  return {
    ...base,
    source,
    browser,
    system,
    device,
  };
}

async function buildContextFromStripeEvent(event: Stripe.Event, referenceId?: string): Promise<AuditContextPayload> {
  const source = event.type;
  const base = await getUserMetadata(referenceId);

  return {
    ...(base as AuditContextPayload),
    source
  };
}

export async function createBetterAuthAudit(ctx: GenericEndpointContext, eventData: AuditEventPayload, userId?: string) {
  const context = await buildContextFromBetterAuth(ctx, userId);

  const payload: AuditLogProps = {
    ...eventData,
    ...context,
  };

  await writeAuditLog(db, payload);
  console.log("Successfully logged Better-Auth event");
}

export async function createRequestAudit(request: Request, eventData: AuditEventPayload, userId?: string) {
  const context = await buildContextFromRequest(request, userId);

  const payload: AuditLogProps = {
    ...eventData,
    ...context,
  };

  await writeAuditLog(db, payload);
  console.log("Successfully logged request event");
}

export async function createStripeEventAudit(event: Stripe.Event, eventData: AuditEventPayload, referenceId?: string) {
  const context = await buildContextFromStripeEvent(event, referenceId);

  const payload: AuditLogProps = {
    ...eventData,
    ...context,
  };

  await writeAuditLog(db, payload);
  console.log("Successfully logged Stripe event");
}
