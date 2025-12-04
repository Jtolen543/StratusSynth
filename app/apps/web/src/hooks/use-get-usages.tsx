"use client"

import { usage } from "@packages/core/db/schemas/usage";
import { useQuery } from "@tanstack/react-query";
import { userLimits } from "@packages/core/pricing";
import { PlanProps, MetricProps} from "@packages/core/pricing";
import { User } from "better-auth";
import { UserUsageRecords } from "@/types/usage";
import { clientAPI } from "@/config/api";

export function useUserUsages(user: User | undefined) {

  const query = useQuery({
    queryKey: ["user-usages", user?.id],
    queryFn: async () => {        
      const body = await clientAPI<{usages: typeof usage.$inferSelect[], plan: PlanProps}>({path: "usage"})
      const result = body.usages.map((usage) => ({
        ...usage, 
        limit: userLimits[body.plan][usage.metric as MetricProps]
      }))

      return {usages: result, plan: body.plan} as UserUsageRecords
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000
  })

  return {
    usages: query.data?.usages,
    plan: query.data?.plan,
    isLoading: query.isLoading,
    isError:  query.isError,
    error: query.error || "",
    refetch: query.refetch
  }
}