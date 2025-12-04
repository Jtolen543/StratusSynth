import { clientAPI } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { ListBucketsAPIResponseProps } from "@packages/types/bucket"

export function useListBuckets() {
  const query = useQuery({
    queryKey: ["list-user-buckets"],
    queryFn: async () => {
      const res = await clientAPI<ListBucketsAPIResponseProps>({
        path: "storage", 
        platform: true
      })
      
      const buckets = res.data
      
      return {
        buckets
      }
    }
  })

  return {
    buckets: query.data?.buckets ?? [],
    
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}