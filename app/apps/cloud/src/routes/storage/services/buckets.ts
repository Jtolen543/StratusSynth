import { Storage } from "@google-cloud/storage";
import pLimit from "p-limit";
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
  return bucket[0]
}

export async function deleteBucket(tenantId: string, bucketName: string) {
  const bucketPath = getBucketPath(tenantId, bucketName)

  await storageClient.bucket(bucketPath).delete()
  return {data: "Successfully deleted bucket"}
}

export async function getBucketDetails(tenantId: string, bucketName: string) {
  const bucketPath = getBucketPath(tenantId, bucketName)

  const [files] = (await storageClient.bucket(bucketPath).getFiles())
  
  const limit = pLimit(10)
  
  const objectMetaData = await Promise.all(
    files.map(file =>
      limit(async () => {
        const [metadata] = await file.getMetadata()
        return metadata
      })
    )
  )
  return objectMetaData
}

export async function listBuckets(tenantId: string) {
  const basePath = getBucketPath(tenantId)

  const buckets = await storageClient.getBuckets({
    prefix: basePath
  })
  return buckets[0]
}

export async function getObjectDetails(tenantId: string, bucketName: string, objectName: string) {
  const basePath = getBucketPath(tenantId, bucketName)

  const object = storageClient.bucket(basePath).file(objectName)
  const [metadata] = await object.getMetadata()

  const [signedURL] = await object.getSignedUrl({
    action: "read",
    expires: Date.now() + (60 * 60 * 1000)
  })
  
  return [metadata, signedURL] as const
}