import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, HardDrive, RefreshCw } from "lucide-react"
import { LoadingPageSkeleton } from "@/components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useGetBucketDetails } from "./queries/useGetBucketDetails"
import { formatDate } from "./utils"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ObjectsContentTab } from "./_components/ObjectContentTab"

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
    <div className="flex flex-col gap-4">
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
        <div className="flex flex-wrap gap-2 px-2 sm:px-4">
          <div className="space-y-1 flex-1 min-w-[180px]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">URI</p>
            <p className="text-sm text-muted-foreground break-all">{details.uri || "--"}</p>
          </div>
          <div className="space-y-1 flex-1 min-w-[180px]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Storage Class</p>
            <p className="text-sm text-muted-foreground">{details.storageClass || "--"}</p>
          </div>
          <div className="space-y-1 flex-1 min-w-[180px]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Location</p>
            <p className="text-sm text-muted-foreground">
              {details.location ? (
                <>
                  {details.location}
                  {details.locationType ? ` (${details.locationType})` : ""}
                </>
              ) : (
                "--"
              )}
            </p>
          </div>
          <div className="space-y-1 flex-1 min-w-[180px]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Location Type</p>
            <p className="text-sm text-muted-foreground">{details.locationType || "--"}</p>
          </div>
          <div className="space-y-1 flex-1 min-w-[180px]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Tenant ID</p>
            <p className="text-sm text-muted-foreground break-all">{details.tenantId || "--"}</p>
          </div>
          <div className="space-y-1 flex-1 min-w-[180px]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Created At</p>
            <p className="text-sm text-muted-foreground">{formatDate(details.createdAt)}</p>
          </div>
          <div className="space-y-1 flex-1 min-w-[180px]">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Last Update</p>
            <p className="text-sm text-muted-foreground break-all">{formatDate(details.updatedAt)}</p>
          </div>
        </div>
      </section>
      <Tabs className="my-8" defaultValue="objects">
        <TabsList className="self-center">
          <TabsTrigger value="objects" className="w-[200px]">Objects</TabsTrigger>
          <TabsTrigger value="configuration" className="w-[200px]">Configuration</TabsTrigger>
          <TabsTrigger value="permissions" className="w-[200px]">Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="objects">
          <ObjectsContentTab details={details} folderMap={bucket.folderMap}/>
        </TabsContent>
        <TabsContent value="configuration">
          Configurations go here
        </TabsContent>
        <TabsContent value="permission">
          Permissions go here
        </TabsContent>
      </Tabs>
    </div>
  )
}
