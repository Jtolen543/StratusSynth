import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionTypes } from "../ManageSubscription";
import { Subscription } from "@better-auth/stripe";

export type SubscriptionMutationPayload = Subscription & {
  action: ActionTypes
  detail?: string
  months?: number
  seats?: number
}

interface SubscriptionMutationResponse {
  id: string
  success: boolean
  message?: string
}

export function useUpdateSubscription() {
  const queryClient = useQueryClient()

  return useMutation<SubscriptionMutationResponse, Error, SubscriptionMutationPayload>({
    mutationKey: ["admin-update-subscription"],
    mutationFn: async (payload: SubscriptionMutationPayload) => {
      const response = await fetch("/api/admin/subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.json();
        throw new Error(errorText.message || "Failed to update subscription.");
      }
      return await response.json()
    },
    onSuccess: async (ctx) => {
      await Promise.all([
        queryClient.invalidateQueries({queryKey: ["admin-user-subscription", ctx.id]})
      ])
    },
    retry: 0
  })
}
