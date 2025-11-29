import { Hono } from "hono";
import { createBucket, deleteBucket, listBuckets } from "./services/buckets";

export const cloudStorageRoutes = new Hono()

cloudStorageRoutes.post("/", async (ctx) => {
  const body = await ctx.req.json()

  const { tenantId, bucketName } = body

  const bucket = await createBucket(tenantId, bucketName)
  return ctx.json({data: bucket})
})

cloudStorageRoutes.get("/", async (ctx) => {
  const query = ctx.req.query()
  const { tenantId } = query
  
  const buckets = await listBuckets(tenantId)
  return ctx.json({data: buckets})
})

cloudStorageRoutes.delete("/", async (ctx) => {
  const query = ctx.req.query()
  const { tenantId, bucketName } = query

  const data = await deleteBucket(tenantId, bucketName)
  return ctx.json(data)
})