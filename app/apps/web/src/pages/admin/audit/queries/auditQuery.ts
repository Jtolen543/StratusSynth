import { clientAPI } from "@/config/api";
import { AuditLogGetResponse } from "@packages/audit";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

export function useListAuditLogs(initialPage: number = 1, initialPageSize: number = 10, initialSearch: string = "") {
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [pageSize, setPageSize] = useState<number>(initialPageSize)
    const [search, setSearch] = useState<string>(initialSearch)

    const query = useQuery({
        queryKey: ["admin-audit-logs", {currentPage, pageSize, search}],
        queryFn: async () => {
            const queries = {
                offset: ((currentPage - 1) * pageSize).toString(),
                limit: pageSize.toString(),
                search: search
            }
            const body = await clientAPI<AuditLogGetResponse>({
                path: "admin/audit",
                queryParams: queries
            })
            
            return {
                logs: body.data,
                totalLogs: body.totalLogs,
                totalPages: Math.ceil(body.totalLogs / pageSize)
            }
        },
        staleTime: 60_000,
        gcTime: 5 * 60_000
    })

    const nextPage = useCallback(() => {
        if (!query.data) return
        setCurrentPage((prev) => Math.min(prev + 1, query.data.totalPages))
    }, [query.data])
    const prevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1))
    }, [])
    const setPage = useCallback((p: number) => {
        setCurrentPage(() => Math.max(1, p))
    }, [])
    const setLimit = useCallback((n: number) => {
        setPageSize(n)
        setCurrentPage(1)
    }, [])

    const actions = useMemo(() => ({
        currentPage,
        search,
        pageSize
    }), [currentPage, search, pageSize, query.data?.totalPages])

    return {
        logs: query.data?.logs ?? [],
        totalLogs: query.data?.totalLogs ?? 0,
        totalPages: query.data?.totalPages ?? 1,

        page: actions.currentPage,
        pageSize: actions.pageSize,
        search: actions.search,

        nextPage,
        prevPage,
        setPage,
        setLimit,
        setSearch,

        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        refetch: query.refetch
    }
}