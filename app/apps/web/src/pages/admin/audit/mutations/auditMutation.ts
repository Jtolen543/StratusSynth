import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuditLogDeleteResponse } from "@packages/audit";
import { clientAPI } from "@/config/api";
import { toast } from "sonner";

export type AuditLogMutationDeletePayload = {
    id?: string
}

export function useDeleteAuditLog() {
    const queryClient = useQueryClient()

    return useMutation<AuditLogDeleteResponse, Error, AuditLogMutationDeletePayload>({
        mutationKey: ["admin-audit-delete-logs"],
        mutationFn: async (payload) => {
            
            const data = await clientAPI<AuditLogDeleteResponse>({
                path: "admin/audit",
                options: {method: "DELETE"},
                queryParams: payload.id ? {id: payload.id} : {},
                errorHandler: (res) => {
                    if (!res.ok) throw new Error("Failed to delete log event")
                }
            })

            return data
        },
        onSuccess: async (ctx) => {
            toast.success(ctx.message)
            await queryClient.invalidateQueries({queryKey: ["admin-audit-logs"]})
        },
        onError: async (ctx) => {
            toast.error(ctx.message)
        }
    })

}