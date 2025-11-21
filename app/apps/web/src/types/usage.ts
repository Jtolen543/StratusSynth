import { usage } from "@packages/core/db/schemas/usage"
import { MetricProps, PlanProps } from "@packages/core/pricing"

export type UsageRecords = Omit<typeof usage.$inferSelect, "metric"> & {
  limit: number
  metric: MetricProps
}

export interface UserUsageRecords {
  usages: UsageRecords[]
  plan: PlanProps
}