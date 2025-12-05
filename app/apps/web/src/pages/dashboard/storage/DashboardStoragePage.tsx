import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, HardDrive, RefreshCw, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { useState } from "react";
import { useListBuckets } from "./queries/useListBuckets";
import { useCreateBucket } from "./mutations/useCreateBucket";
import { useNavigate } from "react-router";

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

const createBucketSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Bucket name must be at least 3 characters")
    .max(18, "Bucket name must be 18 characters or fewer")
    .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers, or hyphens only")
    .transform((value) => value.toLowerCase()),
});

export function DashboardStoragePage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const createBucketMutation = useCreateBucket();
  const { buckets, isLoading, isError, error, refetch } = useListBuckets();
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof createBucketSchema>>({
    resolver: zodResolver(createBucketSchema),
    defaultValues: {
      name: "",
    },
  });

  if (isError) {
    throw error;
  }

  const handleCreateBucket = async (values: z.infer<typeof createBucketSchema>) => {
    try {
      await createBucketMutation.mutateAsync({ bucketName: values.name });
      toast.success("Bucket created successfully");
      form.reset();
      setIsCreateOpen(false);
    } catch (mutationError) {
      const message =
        mutationError instanceof Error ? mutationError.message : "Failed to create bucket";
      toast.error(message);
    }
  };

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
        <div className="flex items-center gap-2">
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                form.reset();
                createBucketMutation.reset();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Create bucket
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new bucket</DialogTitle>
                <DialogDescription>
                  Buckets store your workspace assets. Names must be unique within your project.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleCreateBucket)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bucket name</FormLabel>
                        <FormControl>
                          <Input
                            autoFocus
                            placeholder="workspace-uploads"
                            {...field}
                            disabled={createBucketMutation.isPending}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateOpen(false)}
                      disabled={createBucketMutation.isPending}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createBucketMutation.isPending}>
                      {createBucketMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        "Create bucket"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

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
                  <TableRow 
                  key={bucket.id}
                  onClick={() => navigate(`/dashboard/storage/${bucket.id}`)}
                  className="hover:cursor-pointer"
                >
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
