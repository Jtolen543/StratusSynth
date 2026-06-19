import { Storage } from "@google-cloud/storage"
import pLimit from "p-limit"
import { HTTPException } from "hono/http-exception"
import type { CloudObjectItem, CreateBucketCloudResponseProps, ObjectMetadata } from "@packages/types/bucket"
import type { StorageProvider } from "./StorageProvider"
import { getBucketPath } from "@/routes/storage/services/utils"
import { config } from "@/config"

export class GCSStorageProvider implements StorageProvider {
  private client = new Storage({
    projectId: config.cloud.GCP.projectID,
    credentials: config.cloud.GCP.serviceAccount
  })

  async createBucket(tenantId: string, bucketName: string): Promise<CreateBucketCloudResponseProps> {
    if (!tenantId) throw new HTTPException(401, {
      message: "Must have tenant ID to create bucket",
      cause: "Invalid tenant ID",
    })

    const bucketPath = getBucketPath(tenantId, bucketName)
    const [bucket] = await this.client.createBucket(bucketPath, { location: "US" })
    const [metadata] = await bucket.getMetadata()

    return {
      name: bucketName,
      uri: bucket.cloudStorageURI.href,
      storageClass: metadata.storageClass!,
      location: metadata.location!,
      locationType: metadata.locationType!,
    }
  }

  async deleteBucket(tenantId: string, bucketName: string): Promise<void> {
    const bucketPath = getBucketPath(tenantId, bucketName)
    await this.client.bucket(bucketPath).delete()
  }

  async getBucketDetails(tenantId: string, bucketName: string): Promise<CloudObjectItem[]> {
    const bucketPath = getBucketPath(tenantId, bucketName)
    const [files] = await this.client.bucket(bucketPath).getFiles()

    const limit = pLimit(10)

    return Promise.all(
      files.map(file =>
        limit(async (): Promise<CloudObjectItem> => {
          const [metadata] = await file.getMetadata()
          return {
            name: metadata.name! ?? "",
            size: Number(metadata.size),
            contentType: metadata.contentType ?? "",
            storageClass: metadata.storageClass ?? "",
            createdAt: metadata.timeCreated ?? "",
            updatedAt: metadata.updated ?? "",
          }
        })
      )
    )
  }

  async getObjectDetails(tenantId: string, bucketName: string, objectName: string): Promise<{ metadata: ObjectMetadata; url: string }> {
    const basePath = getBucketPath(tenantId, bucketName)
    const object = this.client.bucket(basePath).file(objectName)
    const metaDataFetch = await object.getMetadata()
    const signedURLFetch = await object.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 60 * 1000,
    })

    const [[raw], [url]] = await Promise.all([metaDataFetch, signedURLFetch])

    return {
      metadata: {
        name: raw.name ?? "",
        size: Number(raw.size),
        contentType: raw.contentType ?? "",
        storageClass: raw.storageClass ?? "",
        createdAt: raw.timeCreated ?? "",
        updatedAt: raw.updated ?? "",
        etag: raw.etag ?? "",
        md5Hash: raw.md5Hash ?? "",
      },
      url,
    }
  }

  async deleteObject(tenantId: string, bucketName: string, objectName: string): Promise<void> {
    const basePath = getBucketPath(tenantId, bucketName)
    await this.client.bucket(basePath).file(objectName).delete()
  }

  async uploadObject(tenantId: string, bucketName: string, objectName: string, fileBuffer: Buffer): Promise<void> {
    const basePath = getBucketPath(tenantId, bucketName)
    await this.client.bucket(basePath).file(objectName).save(fileBuffer)
  }
}
