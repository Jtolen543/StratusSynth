import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useAuditLogMutation() {
    const queryClient = useQueryClient()

    const mutation = useMutation({
        mutationKey: ["admin-audit-logs"],
        mutationFn: async () => {
            
        }
    })
}