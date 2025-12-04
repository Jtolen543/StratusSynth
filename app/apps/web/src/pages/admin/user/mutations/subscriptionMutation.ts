import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ActionTypes } from "../components/ManageSubscription";
import { Subscription } from "@better-auth/stripe";
import { clientAPI } from "@/config/api";
import { toast } from "sonner";

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
      const data = await clientAPI<SubscriptionMutationResponse>({
        path: "admin/subscription",
        options: {
          method: "POST",
          body: JSON.stringify(payload)
        },
        errorHandler: async (response) => {
          if (!response.ok) {
            const errorText = await response.json();
            throw new Error(errorText.message || "Failed to update subscription.");
          }
        }
      });


      return data
    },
    onSuccess: async (ctx) => {
      toast.success(ctx.message)
      await Promise.all([
        queryClient.invalidateQueries({queryKey: ["admin-user-subscription", ctx.id]})
      ])
    },
    retry: 1
  })
}
