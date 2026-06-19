import { Hono } from "hono";
import { GCSStorageProvider } from "@/providers/storage/GCSStorageProvider";

const provider = new GCSStorageProvider()

export const cloudBucketRoutes = new Hono()

cloudBucketRoutes.post("/", async (ctx) => {
  const { tenantId, bucketName } = await ctx.req.json() as { tenantId: string; bucketName: string }
  const data = await provider.createBucket(tenantId, bucketName)
  return ctx.json(data)
})

cloudBucketRoutes.get("/", async (ctx) => {
  const { tenantId, bucketName } = ctx.req.query()
  const data = await provider.getBucketDetails(tenantId, bucketName)
  return ctx.json(data)
})

cloudBucketRoutes.delete("/", async (ctx) => {
  const { tenantId, bucketName } = ctx.req.query()
  await provider.deleteBucket(tenantId, bucketName)
  return ctx.json({ data: "Successfully deleted bucket" })
})

cloudBucketRoutes.post("/objects", async (ctx) => {
  return ctx.json({})
})

cloudBucketRoutes.get("/objects", async (ctx) => {
  const { tenantId, bucketName, objectName } = ctx.req.query()
  const data = await provider.getObjectDetails(tenantId, bucketName, objectName)
  return ctx.json(data)
})

cloudBucketRoutes.delete("/objects", async (ctx) => {
  return ctx.json({})
})
