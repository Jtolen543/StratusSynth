import { clientAPI } from "@/config/api";
import { useQuery } from "@tanstack/react-query";
import { GetBucketAPIResponseProps } from "@packages/types/bucket"
import { formatBucketTree, getFolderPathMap } from "../utils";

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
      const folderMap = getFolderPathMap(formattedBuckets)
      
      return {
        details: formattedBuckets,
        folderMap: folderMap
      }
    },
    staleTime: 60_000,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false  
  })

  return {
    details: query.data?.details ?? undefined,
    folderMap: query.data?.folderMap ?? {},
    
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch
  }
}

export type HookBucketDetails = NonNullable<ReturnType<typeof useGetBucketDetails>["details"]>