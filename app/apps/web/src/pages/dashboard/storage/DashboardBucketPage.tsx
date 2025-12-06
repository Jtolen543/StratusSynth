import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, HardDrive, RefreshCw } from "lucide-react"
import { LoadingPageSkeleton } from "@/components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetBucketDetails } from "./queries/useGetBucketDetails"

function formatDate(value?: string | Date | null) {
  if (!value) return "--"
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return "--"

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function formatBytes(value?: number | null) {
  if (value === undefined || value === null) return "--"
  if (value === 0) return "0 B"

  const units = ["B", "KB", "MB", "GB", "TB"]
  let size = value
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const precision = size >= 10 ? 0 : 1
  return `${size.toFixed(precision)} ${units[unitIndex]}`
}

export function DashboardBucketPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) {
      navigate("/dashboard/storage")
    }
  }, [id, navigate])

  const bucket = useGetBucketDetails(id ?? "")

  useEffect(() => {
    if (bucket.isError) {
      toast.error(bucket.error?.message ?? "Failed to load bucket details")
      navigate("/dashboard/storage")
    }
  }, [bucket.error?.message, bucket.isError, navigate])

  if (!id) return null

  if (bucket.isLoading) {
    return <LoadingPageSkeleton />
  }

  if (bucket.isError) return null

  if (!bucket.details) {
    return (
      <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
        Bucket details are unavailable right now.
      </div>
    )
  }

  const details = bucket.details

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary/10 p-3">
            <HardDrive className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
              <span>Bucket</span>
              <Badge variant="secondary" className="text-[11px] font-medium">
                {details.id}
              </Badge>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold tracking-tight">{details.name}</h1>
              <p className="text-sm text-muted-foreground break-all">{details.uri}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="uppercase">
                {details.storageClass || "Unknown class"}
              </Badge>
              {details.location && (
                <Badge variant="secondary">
                  {details.location}
                  {details.locationType ? ` (${details.locationType})` : ""}
                </Badge>
              )}
              <Badge variant="secondary">Tenant {details.tenantId}</Badge>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard/storage")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to buckets
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => bucket.refetch()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle>Bucket overview</CardTitle>
          <CardDescription>
            Parent metadata from <code>bucket.details</code>. Child objects will appear once implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase text-muted-foreground">Bucket ID</dt>
              <dd className="mt-1 text-base font-medium text-foreground break-all">
                {details.id}
              </dd>
            </div>
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase text-muted-foreground">Location</dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                {details.location || "--"}
              </dd>
              {details.locationType && (
                <p className="text-xs text-muted-foreground">{details.locationType}</p>
              )}
            </div>
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase text-muted-foreground">Storage class</dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                {details.storageClass || "--"}
              </dd>
            </div>
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase text-muted-foreground">URI</dt>
              <dd className="mt-1 text-base font-medium text-foreground break-all">
                {details.uri}
              </dd>
            </div>
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase text-muted-foreground">Created</dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                {formatDate(details.createdAt)}
              </dd>
            </div>
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase text-muted-foreground">Updated</dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                {formatDate(details.updatedAt)}
              </dd>
            </div>
            <div className="rounded-lg border p-4">
              <dt className="text-xs uppercase text-muted-foreground">Size</dt>
              <dd className="mt-1 text-base font-medium text-foreground">
                {formatBytes(details.size)}
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  )
}
