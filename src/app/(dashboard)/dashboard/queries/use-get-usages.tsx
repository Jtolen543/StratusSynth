"use client"

import { usage } from "@/db/schemas/plan";
import { useQuery } from "@tanstack/react-query";
import { userLimits } from "@/lib/stripe";
import { PlanProps, MetricProps} from "@/lib/stripe";

export function useUserUsages() {

  const query = useQuery({
    queryKey: ["user-usages"],
    queryFn: async () => {
      const res = await fetch("/api/usage")
      const body: {usages: typeof usage.$inferSelect[], plan: PlanProps} = await res.json()
      const result = body.usages.map((usage) => ({...usage, limit: userLimits[body.plan][usage.metric as MetricProps]}))
      return result
    }
  })

  return {
    data: query?.data ?? [],
    isLoading: query.isLoading,
    isError:  query.isError,
    error: query.error || "",
    refetch: query.refetch
  }
}