import { useQuery } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins";
import { authClient } from "@/lib/authentication/auth-client";

export function useGetSubscription(user: UserWithRole) {

  const query = useQuery({
    queryKey: ["admin-user-subscription", user.id],
    queryFn: async () => {
      const {data, error} = await authClient.subscription.list({
        query: {referenceId: user.id},
      });

      if (error) throw error

      const subscription = data[0]
      return {
        subscription
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  })

  return {
    subscription: query.data?.subscription ?? null,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  }
}