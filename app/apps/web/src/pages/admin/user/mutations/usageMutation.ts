import { clientAPI } from "@/config/api";
import { MetricProps } from "@packages/core/pricing";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserWithRole } from "better-auth/plugins";

export type UsageMutationPayload = UserWithRole & {
  usages: Record<MetricProps, number>
}

export interface UsageMutationResponse {
  id: string
  success: boolean
  message?: string
}

export function useUpdateUsage() {
  const queryClient = useQueryClient()

  return useMutation<UsageMutationResponse, Error, UsageMutationPayload>({
    mutationKey: ["admin-update-usage"],
    mutationFn: async (payload) => {
      const response = await clientAPI({
        path: "admin/usage",
        options: {
          method: "POST",
          body: JSON.stringify(payload)
        }
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || "Failed to update subscription.");
      }
      return await response.json()
    },
    onSuccess: async (ctx) => {
      await Promise.all([
        queryClient.invalidateQueries({queryKey: ["admin-user-usages", ctx.id]})
      ])
    },
    retry: 0
  })
}