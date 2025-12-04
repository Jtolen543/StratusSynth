import { Hono } from "hono";
import { createBucket, deleteBucket, listBuckets } from "./services/buckets";
import { getBucketMetaInformation } from "./services/utils";

export const cloudStorageRoutes = new Hono()

cloudStorageRoutes.post("/", async (ctx) => {
  const body = await ctx.req.json()

  const { tenantId, bucketName } = body as {tenantId: string, bucketName: string}

  const bucket = await createBucket(tenantId, bucketName)
  const data = await getBucketMetaInformation(bucket, bucketName)
  return ctx.json({data})
})

cloudStorageRoutes.delete("/", async (ctx) => {
  const query = ctx.req.query()
  const { tenantId, bucketName } = query

  const data = await deleteBucket(tenantId, bucketName)
  return ctx.json(data)
})