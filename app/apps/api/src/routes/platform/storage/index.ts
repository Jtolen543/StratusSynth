import { serviceClient } from "@/lib/service";
import { Hono } from "hono";
import { CreateBucketCloudResponseProps } from "@packages/types/bucket"
import { HTTPException } from "hono/http-exception";
import { db } from "@/lib/db";
import { bucket } from "@packages/core/db/schemas/platform/storage";
import { eq } from "drizzle-orm";

export const platformStorageRoutes = new Hono()

platformStorageRoutes.post("/", async (ctx) => {
  const tenantId = ctx.get("tenant")
  const { bucketName } = ctx.req.query()

  if (bucketName && bucketName.length > 18) throw new HTTPException(400, {
    cause: "Invalid bucket name",
    message: "Bucket name must be at most 18 characters long"
  })

  const response = await serviceClient<CreateBucketCloudResponseProps>({
    path: "storage",
    body: JSON.stringify({tenantId, bucketName})
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

platformStorageRoutes.get("/", async (ctx) => {
  const tenantId = ctx.get("tenant")
  const buckets = await db.select().from(bucket).where(eq(bucket.tenantId, tenantId))

  return ctx.json({data: buckets})
})