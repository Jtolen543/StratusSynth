import { serviceClient } from "@/lib/service";
import { Hono } from "hono";
import { CreateBucketCloudResponseProps, GetBucketCloudResponseProps } from "@packages/types/bucket"
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/db";
import { bucket } from "@packages/core/db/schemas/bucket";
import { eq } from "drizzle-orm";
import { buildBucketTree } from "./utils";

export const platformBucketRoutes = new Hono()

platformBucketRoutes.post("/", async (ctx) => {
  const tenantId = ctx.get("tenant")
  const { bucketName } = await ctx.req.json()

  if (bucketName && bucketName.length > 26) throw new HTTPException(400, {
    cause: "Invalid bucket name",
    message: "Bucket name must be at most 26 characters long"
  })


  const response = await serviceClient<CreateBucketCloudResponseProps>({
    path: "bucket",
    body: {tenantId, bucketName},
    method: "POST"
  })

  const body = {
    tenantId: tenantId,
    name: response.name,
    uri: response.uri,
    location: response.location,
    storageClass: response.storageClass,
    locationType: response.location,
  }

  await db.insert(bucket).values(body)
  return ctx.json(body)
})

platformBucketRoutes.get("/", async (ctx) => {
  const tenantId = ctx.get("tenant")
  const buckets = await db.select().from(bucket).where(eq(bucket.tenantId, tenantId))

  return ctx.json({data: buckets})
})

platformBucketRoutes.get("/:id", async (ctx) => {
  const id = ctx.req.param('id')
  const bucketData = await db.query.bucket.findFirst({
    where: (bucket, {eq}) => eq(bucket.id, id)
  })

  if (!bucketData) throw new HTTPException(403, {
    cause: "Invalid bucket ID",
    message: "Failed to retrieve bucket information"
  })

  const response = await serviceClient<GetBucketCloudResponseProps>({
    path: "bucket",
    queryParams: {tenantId: bucketData.tenantId, bucketName: bucketData.name},
  })

  const fileTree = buildBucketTree(response)

  const data = {
    ...bucketData,
    children: fileTree
  }

  return ctx.json({data})
})