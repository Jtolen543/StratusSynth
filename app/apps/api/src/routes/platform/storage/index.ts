import { serviceClient } from "@/lib/service";
import { Hono } from "hono";
import { CreateBucketResponseProps } from "@packages/types/bucket"
import { HTTPException } from "hono/http-exception";

export const platformStorageRoutes = new Hono()

platformStorageRoutes.post("/", async (ctx) => {
  const tenantId = ctx.get("tenant")
  const { bucketName } = ctx.req.query()

  if (bucketName && bucketName.length > 18) throw new HTTPException(400, {
    cause: "Invalid bucket name",
    message: "Bucket name must be at most 18 characters long"
  })

  const response = await serviceClient<CreateBucketResponseProps>({
    path: "storage",
    body: JSON.stringify({tenantId, bucketName})
  })

  return ctx.json(response.data)
})