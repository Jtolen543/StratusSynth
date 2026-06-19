import { useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { toast } from "sonner"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import { LoadingPageSkeleton } from "@/components"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatBytes, formatDate, iconExtensionMatcher } from "./utils"
import { useGetObjectDetails } from "./queries/useGetObjectDetails"

export function DashboardObjectPage() {
  const { id, name } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (!id || !name) navigate("/dashboard/storage")
  }, [id, name, navigate])

  const object = useGetObjectDetails(id ?? "", name ?? "")

  useEffect(() => {
    if (object.isError) {
      toast.error(object.error?.message ?? "Failed to load object details")
      navigate(`/dashboard/storage/${id}`)
    }
  }, [object.isError, object.error?.message, id, navigate])

  if (!id || !name) return null
  if (object.isLoading) return <LoadingPageSkeleton />
  if (object.isError) return null

  const { metadata, url } = object
  const isImage = metadata?.contentType?.startsWith("image/") ?? false

  const metaFields = metadata
    ? [
        { label: "Content Type", value: metadata.contentType || "--" },
        { label: "Size", value: formatBytes(metadata.size) },
        { label: "Storage Class", value: metadata.storageClass || "--" },
        { label: "Created", value: formatDate(metadata.createdAt) ?? "--" },
        { label: "Updated", value: formatDate(metadata.updatedAt) ?? "--" },
        { label: "ETag", value: metadata.etag || "--" },
        { label: "MD5", value: metadata.md5Hash || "--" },
      ]
    : []

  return (
    <div className="flex flex-col gap-6">
      <section className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shrink-0">
              {iconExtensionMatcher(name)}
            </div>
            <div className="space-y-2 min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
                <span>Object</span>
                {object.bucketName && (
                  <Badge variant="secondary" className="text-[11px] font-medium">
                    {object.bucketName}
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight break-all">{name}</h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => navigate(`/dashboard/storage/${id}`)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to bucket
            </Button>
            <Button variant="outline" size="sm" onClick={() => object.refetch()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            {url && (
              <Button size="sm" asChild>
                <a href={url} target="_blank" rel="noopener noreferrer" download={name}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4 px-2 sm:px-4">
          {metaFields.map(({ label, value }) => (
            <div key={label} className="space-y-1 flex-1 min-w-[180px]">
              <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
              <p className="text-sm text-muted-foreground break-all">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {url && (
        <section>
          <Card className="overflow-hidden border border-border/70 shadow-sm">
            <CardContent className="p-0">
              {isImage ? (
                <div className="flex items-center justify-center bg-muted/20 p-4 min-h-[300px]">
                  <img
                    src={url}
                    alt={name}
                    className="max-w-full max-h-[600px] rounded object-contain"
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-16 text-muted-foreground">
                  <div className="text-4xl">{iconExtensionMatcher(name)}</div>
                  <p className="text-sm">Preview not available for this file type.</p>
                  <Button asChild>
                    <a href={url} target="_blank" rel="noopener noreferrer" download={name}>
                      <Download className="mr-2 h-4 w-4" />
                      Download to view
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  )
}
