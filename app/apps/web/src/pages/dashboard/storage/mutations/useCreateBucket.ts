import { clientAPI } from "@/config/api";
import { CreateBucketAPIResponseProps } from "@packages/types/bucket";
import { useQueryClient, useMutation } from "@tanstack/react-query";

type CreateBucketMutationPayload = {
  bucketName: string
}

export function useCreateBucket() {
  const queryClient = useQueryClient()

  return useMutation<CreateBucketAPIResponseProps, Error, CreateBucketMutationPayload>({
    mutationKey: ["create-storage-bucket"],
    mutationFn: async ({bucketName}) => {
      const normalizedName = bucketName.trim()

      const data = await clientAPI<CreateBucketAPIResponseProps>({
        path: "bucket",
        platform: true,
        options: {
          method: "POST",
          body: JSON.stringify({bucketName: normalizedName})
        }
      })

      return data
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["list-user-buckets"]
      })
    }
  })
}
