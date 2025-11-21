import { auditLogs } from "../core/db/schemas/audit"

export type AuditStatus = "SUCCESS" | "FAILED";

export type AuditEventPayload = {
  event: string;
  description: string;
  detail: string;
  status: AuditStatus;
};

export type AuditContextPayload = {
  source: string;
  referenceId?: string;
  sessionId?: string;
  device?: string;
  system?: string;
  browser?: string;
  email?: string;
};

export type AuditLogProps = AuditEventPayload & AuditContextPayload;

export type AuditLogGetResponse = {
  data: typeof auditLogs.$inferSelect[],
  totalLogs: number
}

export type AuditLogDeleteResponse = {
  id: string
  message: string
}
