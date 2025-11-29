import { Storage } from "@google-cloud/storage";
import { getBucketPath } from "./utils";
import { HTTPException } from "hono/http-exception";

const storageClient = new Storage()

export async function createBucket(tenantId: string, bucketName: string) {
  if (!tenantId) throw new HTTPException(401, {
    message: "Must have tenant ID to create bucket",
    cause: "Invalid tenant ID"
  })
  const bucketPath = getBucketPath(tenantId, bucketName)  

  const bucket = await storageClient.createBucket(bucketPath, {
    location: "US",
  })
  return bucket
}

export async function deleteBucket(tenantId: string, bucketName: string) {
  const bucketPath = getBucketPath(tenantId, bucketName)

  await storageClient.bucket(bucketPath).delete()
  return {data: "Successfully deleted bucket"}
}

export async function getBucket(tenantId: string, bucketName: string) {
  const bucketPath = getBucketPath(tenantId, bucketName)

  const bucket = (await storageClient.bucket(bucketPath).get())[0]
  return bucket
}

export async function listBuckets(tenantId: string) {
  const basePath = getBucketPath(tenantId)

  const buckets = await storageClient.getBuckets({
    prefix: basePath
  })
  return buckets
}