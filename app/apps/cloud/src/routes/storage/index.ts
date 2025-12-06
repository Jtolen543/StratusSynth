import { Hono } from "hono";
import { createBucket, deleteBucket, getBucketDetails } from "./services/buckets";
import { getBucketMetaInformation } from "./services/utils";

export const cloudBucketRoutes = new Hono()

cloudBucketRoutes.post("/", async (ctx) => {
  const body = await ctx.req.json()

  const { tenantId, bucketName } = body as {tenantId: string, bucketName: string}

  const bucket = await createBucket(tenantId, bucketName)
  const data = await getBucketMetaInformation(bucket, bucketName)
  return ctx.json({...data})
})

cloudBucketRoutes.get("/", async (ctx) => {
  const {tenantId, bucketName} = ctx.req.query()

  const data = await getBucketDetails(tenantId, bucketName)
  return ctx.json(data)
})

cloudBucketRoutes.delete("/", async (ctx) => {
  const query = ctx.req.query()
  const { tenantId, bucketName } = query

  const data = await deleteBucket(tenantId, bucketName)
  return ctx.json(data)
})