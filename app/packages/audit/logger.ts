import { auditLogs } from "../core/db/schemas/audit"
import type { DrizzleInstance } from "@packages/core/db/types";
import type { AuditLogProps } from "../types/audit";

export async function writeAuditLog(db: DrizzleInstance, payload: AuditLogProps) {
  await db.insert(auditLogs).values({
    event: payload.event,
    description: payload.description,
    detail: payload.detail,
    status: payload.status,
    source: payload.source,
    referenceId: payload.referenceId,
    sessionId: payload.sessionId,
    device: payload.device,
    system: payload.system,
    browser: payload.browser,
    email: payload.email,
  });
}
