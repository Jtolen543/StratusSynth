import { usage } from "@/db/schemas/usage"
import { MetricProps, PlanProps } from "@/lib/stripe"


export type UsageRecords = Omit<typeof usage.$inferSelect, "metric"> & {
  limit: number
  metric: MetricProps
}

export interface UserUsageRecords {
  usages: UsageRecords[]
  plan: PlanProps
}