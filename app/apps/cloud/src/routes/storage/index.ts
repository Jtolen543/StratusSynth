import { Hono } from "hono";
import { createBucket, deleteBucket, getBucketDetails, getObjectDetails } from "./services/buckets";
import { getBucketMetaInformation } from "./services/utils";
import { stream } from "hono/streaming";

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

cloudBucketRoutes.post("/objects", async (ctx) => {

  return ctx.json({})
})

cloudBucketRoutes.get("/objects", async (ctx) => {
  const {tenantId, bucketName, objectName} = ctx.req.query()
  const [metadata, url] = await getObjectDetails(tenantId, bucketName, objectName)
  
  return ctx.json({metadata, url})
})

cloudBucketRoutes.delete("/objects", async (ctx) => {

  return ctx.json({})
})