"use client";

import { ReactElement, useEffect, useMemo, useState } from "react";
import { useListAuditLogs } from "./queries/auditQuery";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Globe2,
  Loader2,
  MonitorSmartphone,
  Search
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function formatDate(value?: string | Date | null) {
  if (!value) return "—";
  const date = value instanceof Date ? value : new Date(value);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type StatusMeta = {
  label: string;
  badgeClass: string;
  icon: ReactElement;
};

const STATUS_META: Record<string, StatusMeta> = {
  SUCCESS: {
    label: "Success",
    badgeClass: "bg-emerald-500/15 text-emerald-500 border border-transparent",
    icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
  },
  FAILED: {
    label: "Failed",
    badgeClass: "bg-red-500/15 text-red-500 border border-transparent",
    icon: <AlertCircle className="h-5 w-5 text-red-500" />,
  },
};

export default function AdminAuditLogsPage() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)
  const [goToPage, setGoToPage] = useState<number>(1)
  const auditData = useListAuditLogs();

  useEffect(() => {
    const timer = setTimeout(() => {
      auditData.setSearch(searchValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchValue, auditData]);

  if (auditData.isError) {
    throw auditData.error;
  }

  const paginationRange = useMemo(() => {
    const start = Math.max(1, auditData.page - 2);
    const end = Math.min(auditData.totalPages, auditData.page + 2);
    return Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  }, [auditData.page, auditData.totalPages]);

  const renderStatus = (status: string) => {
    const meta = STATUS_META[status] ?? STATUS_META.FAILED;
    return (
      <Badge className={meta.badgeClass} variant="outline">
        {meta.label}
      </Badge>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="space-y-6">
          <div>
            <CardTitle>Security &amp; Activity Log</CardTitle>
            <CardDescription>
              Review authentication events, Stripe webhooks, and other critical
              actions across the application.
            </CardDescription>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex w-full flex-col gap-8 sm:flex-row sm:items-center justify-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search logs..."
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="rows" className="text-sm font-medium">Rows per page</Label>
                <Input 
                  id="rows"
                  value={rowsPerPage}
                  onChange={(event) =>{
                    const value = parseInt(event.target.value) || 10
                    setRowsPerPage(value)
                    auditData.setLimit(value)
                  }}
                  min={1}
                  max={100}
                  type="number"
                />
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="rows" className="text-sm font-medium">Go to Page</Label>
                  <Input 
                    id="rows"
                    value={goToPage}
                    onChange={(event) =>{
                      const value = parseInt(event.target.value) || 10
                      setGoToPage(value)
                    }}
                    min={1}
                    max={auditData.totalPages}
                    type="number"
                  />
                </div>
                <Button
                  onClick={() => {
                    auditData.setPage(goToPage)
                  }}
                >
                  Go
                </Button>
              </div>
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={auditData.prevPage} />
                </PaginationItem>
                {paginationRange.map((page) => (
                  <PaginationItem
                    key={page}
                    onClick={() => auditData.setPage(page)}
                    aria-disabled={auditData.page === page}
                    className={auditData.page === page ? "text-muted-foreground" : ""}
                  >
                    {page}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext onClick={auditData.nextPage} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          <div className="text-sm text-muted-foreground">
            Showing {(auditData.page - 1) * auditData.pageSize + 1} –{" "}
            {Math.min(auditData.page * auditData.pageSize, auditData.totalLogs)} of{" "}
            {auditData.totalLogs} logs
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {auditData.isLoading && (
            <div className="flex items-center justify-center rounded-lg border border-dashed py-12 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading audit history...
            </div>
          )}

          {!auditData.isLoading && auditData.logs.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed py-12 text-sm text-muted-foreground">
              No audit activity matches your filters.
            </div>
          )}

          {!auditData.isLoading &&
            auditData.logs.map((log) => {
              const statusIcon =
                STATUS_META[log.status]?.icon ?? STATUS_META.FAILED.icon;

              return (
                <div
                  key={log.id}
                  className="rounded-xl border bg-card/60 p-5 shadow-sm transition hover:border-primary/50 hover:shadow-lg"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                        {statusIcon}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-base font-semibold leading-none">
                            {log.event}
                          </h3>
                          {renderStatus(log.status)}
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {log.description}
                        </p>
                        {log.detail && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {log.detail}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 text-right text-xs text-muted-foreground sm:text-sm">
                      {log.source && (
                        <div className="font-medium text-foreground">{log.source}</div>
                      )}
                      {log.referenceId && (
                        <div className="break-all">{log.referenceId}</div>
                      )}
                      {log.sessionId && (
                        <div className="break-all text-xs text-muted-foreground">
                          Session {log.sessionId}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-2">
                        <MonitorSmartphone className="h-4 w-4" />
                        <span>
                          {[log.device, log.browser, log.system]
                            .filter(Boolean)
                            .join(" • ") || "Unknown client"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(log.createdAt)}</span>
                      </div>
                      {log.email && (
                        <div className="flex items-center gap-2">
                          <Globe2 className="h-4 w-4" />
                          <span>{log.email}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </CardContent>
      </Card>
    </div>
  );
}
