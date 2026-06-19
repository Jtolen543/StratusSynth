import { clientAPI } from "@/config/api"
import { useQuery } from "@tanstack/react-query"
import type { GetObjectCloudResponseProps, ListBucketsAPIResponseProps } from "@packages/types/bucket"

export function useGetObjectDetails(bucketId: string, objectName: string) {
  const query = useQuery({
    queryKey: ["get-object-details", bucketId, objectName],
    queryFn: async () => {
      const bucketsRes = await clientAPI<ListBucketsAPIResponseProps>({
        path: "bucket",
        platform: true,
      })

      const bucketData = bucketsRes.data.find(b => b.id === bucketId)
      if (!bucketData) throw new Error("Bucket not found")

      const data = await clientAPI<GetObjectCloudResponseProps>({
        path: "bucket/objects",
        platform: true,
        queryParams: { bucketName: bucketData.name, objectName },
      })

      return { ...data, bucketName: bucketData.name }
    },
    enabled: !!bucketId && !!objectName,
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
  })

  return {
    metadata: query.data?.metadata,
    url: query.data?.url,
    bucketName: query.data?.bucketName,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}
