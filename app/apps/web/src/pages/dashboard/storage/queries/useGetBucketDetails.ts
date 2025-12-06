import { clientAPI } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { GetBucketAPIResponseProps } from "@packages/types/bucket"
import { formatBucketTree } from "../utils";

export function useGetBucketDetails(id: string) {
  const query = useQuery({
    queryKey: ["get-bucket-details", id],
    queryFn: async () => {
      const response = await clientAPI<GetBucketAPIResponseProps>({
        path: `bucket/${id}`, 
        platform: true,
      })
    
      const buckets = response.data
      const formattedBuckets = formatBucketTree(buckets)
      
      return {
        details: formattedBuckets
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false  
  })

  return {
    details: query.data?.details ?? undefined,
    
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}