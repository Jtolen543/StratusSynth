import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/authentication/auth-client";
import { useState, useCallback, useMemo } from "react";

type SearchByType = "email" | "name" | undefined

export function useListUsers(initialPageSize = 10, initialPage = 1, initialSearch = "", initialSearchBy: SearchByType = "email") {
  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [search, setSearch] = useState<string>(initialSearch)
  const [searchBy, setSearchBy] = useState<"email" | "name">(initialSearchBy)

  const query = useQuery({
    queryKey: ["admin-list-users", { page: currentPage, pageSize, search, searchBy }],
    queryFn: async () => {
      const { error, data } = await authClient.admin.listUsers({
        query: { 
          limit: pageSize, 
          offset: (currentPage - 1) * pageSize,
          searchValue: search,
          searchField: searchBy,
          sortBy: "email",
          sortDirection: "asc"
        },
      });
      if (error) throw error;

      const total = data?.total ?? 0;
      const users = (data?.users) ?? [];
      const totalPages = Math.max(1, Math.ceil(total / pageSize));

      return { totalUsers: total, totalPages, users, limit: pageSize };
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    retry: 1,
  });

  const nextPage = useCallback(() => {
    if (!query.data) return
    setCurrentPage((prev) => Math.min(prev + 1, query.data.totalPages))
  }, [query.data])
  const prevPage = useCallback(() => setCurrentPage((prev) => Math.max(prev - 1, 1)), [])
  const setPage = useCallback((p: number) => setCurrentPage(Math.max(1, p)), [])
  const setLimit = useCallback((n: number) => {
    setPageSize(n)
    setCurrentPage(1)
  }, [])

  const meta = useMemo(
    () => ({
      page: currentPage,
      pageSize,
      search,
      searchBy,
      hasNext: (query.data?.totalPages ?? 1) > currentPage,
      hasPrev: currentPage > 1,
    }),
    [currentPage, pageSize, query.data?.totalPages, search, searchBy]
  );

  return {
    users: query.data?.users ?? [],
    totalUsers: query.data?.totalUsers ?? 0,
    totalPages: query.data?.totalPages ?? 1,
    limit: query.data?.limit ?? pageSize,

    page: meta.page,
    pageSize: meta.pageSize,
    hasNext: meta.hasNext,
    hasPrev: meta.hasPrev,

    nextPage,
    prevPage,
    setPage,
    setPageSize: setLimit,
    setSearch,
    setSearchBy,

    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
