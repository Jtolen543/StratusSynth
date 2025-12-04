import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, HardDrive, RefreshCw } from "lucide-react";
import { useListBuckets } from "./queries/useListBuckets";

function formatDate(value?: string | Date | null) {
  if (!value) return "--";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "--";

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

function formatBytes(value?: number | null) {
  if (value === undefined || value === null) return "--";
  if (value === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = value;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  const precision = size >= 10 ? 0 : 1;
  return `${size.toFixed(precision)} ${units[unitIndex]}`;
}

export function DashboardStoragePage() {
  const { buckets, isLoading, isError, error, refetch } = useListBuckets();

  if (isError) {
    throw error;
  }

  const bucketCountLabel = `${buckets.length} bucket${buckets.length === 1 ? "" : "s"}`;

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Storage</h2>
          <p className="text-muted-foreground">
            Browse all buckets available to your workspace.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Buckets</CardTitle>
            <CardDescription>Storage buckets tied to this tenant.</CardDescription>
          </div>
          <Badge variant="secondary" className="w-fit">
            {isLoading ? "Loading..." : bucketCountLabel}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading && (
            <div className="flex items-center justify-center rounded-lg border border-dashed py-10 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading buckets...
            </div>
          )}

          {!isLoading && buckets.length === 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed py-10 text-sm text-muted-foreground">
              No buckets found for this workspace.
            </div>
          )}

          {!isLoading && buckets.length > 0 && (
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow className="text-muted-foreground">
                  <TableHead>Name</TableHead>
                  <TableHead>URI</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Storage Class</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buckets.map((bucket) => (
                  <TableRow key={bucket.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <HardDrive className="h-4 w-4 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span>{bucket.name}</span>
                          <span className="text-xs text-muted-foreground">{bucket.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-normal break-all text-xs text-muted-foreground">
                      {bucket.uri}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-0.5">
                        <span>{bucket.location}</span>
                        {bucket.locationType && (
                          <span className="text-xs text-muted-foreground">
                            {bucket.locationType}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="uppercase">
                        {bucket.storageClass || "--"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatBytes(bucket.size)}</TableCell>
                    <TableCell>{formatDate(bucket.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
