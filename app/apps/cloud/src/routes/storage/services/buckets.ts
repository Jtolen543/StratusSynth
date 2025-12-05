import { Storage, FileMetadata } from "@google-cloud/storage";
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

export async function getBucket(tenantId: string, bucketName: string) {
  const bucketPath = getBucketPath(tenantId, bucketName)

  const [files] = (await storageClient.bucket(bucketPath).getFiles())
  
  const objectMetaData: FileMetadata[] = new Array()

  for (const file of files) {
    const [metaData] = await file.getMetadata()
    objectMetaData.push(metaData)
  }

  return objectMetaData
}

export async function listBuckets(tenantId: string) {
  const basePath = getBucketPath(tenantId)

  const buckets = await storageClient.getBuckets({
    prefix: basePath
  })
  return buckets[0]
}