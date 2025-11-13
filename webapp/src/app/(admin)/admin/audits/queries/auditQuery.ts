import { AuditLogGetResponse } from "@/app/api/admin/audit/route";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

export function useListAuditLogs(initialPage: number = 1, initialPageSize: number = 10, initialSearch: string = "") {
    const [currentPage, setCurrentPage] = useState<number>(initialPage)
    const [pageSize, setPageSize] = useState<number>(initialPageSize)
    const [search, setSearch] = useState<string>(initialSearch)

    const query = useQuery({
        queryKey: ["admin-audit-logs", {currentPage, pageSize, search}],
        queryFn: async () => {
            const url = new URL("/api/admin/audit", process.env.NEXT_PUBLIC_BASE_URL)
            url.searchParams.set("offset", ((currentPage - 1) * pageSize).toString())
            url.searchParams.set("limit", pageSize.toString())
            url.searchParams.set("search", search)
            const res = await fetch(url)
            const body: AuditLogGetResponse = await res.json()
            
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
        setCurrentPage((prev) => Math.max(1, p))
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