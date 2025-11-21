import { UserWithRole } from "better-auth/plugins";
import { MetricProps } from "../core/pricing"

export type UsageMutationPayload = UserWithRole & {
  usages: Record<MetricProps, number>
}

export interface UsageMutationResponse {
  id: string
  success: boolean
  message?: string
}