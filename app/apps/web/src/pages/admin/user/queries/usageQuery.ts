import { usage } from "@packages/core/db/schemas/usage";
import { useQuery } from "@tanstack/react-query";
import { PlanProps, MetricProps, userLimits } from "@packages/core/pricing";
import { User } from "better-auth";
import { UserUsageRecords } from "@/types/usage";
import { clientAPI } from "@/config/api";

interface UseGetUsageOptions {
  enabled?: boolean;
}

export function useGetUsage(user: User | undefined, options: UseGetUsageOptions = {}) {
  const userId = user?.id;
  const query = useQuery({
    queryKey: ["admin-user-usages", userId],
    enabled: Boolean(userId) && (options.enabled ?? true),
    queryFn: async () => {
      if (!userId) throw new Error("Invalid user id");

      const res = await clientAPI({
        path: "/api/admin/usage",
        queryParams: {id: user.id}
      });
      if (!res.ok) {
        throw new Error("Failed to load usage data.");
      }

      const body: { usages: typeof usage.$inferSelect[], plan: PlanProps } = await res.json();
      console.log(body)
      const result = body.usages.map((usage) => ({
        ...usage, 
        limit: userLimits[body.plan][usage.metric as MetricProps]
      }));
      const data = {usages: result, plan: body.plan} as UserUsageRecords
      return data
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
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
