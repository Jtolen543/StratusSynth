import type { CloudObjectItem, CreateBucketCloudResponseProps, ObjectMetadata } from "@packages/types/bucket"

export interface StorageProvider {
  createBucket(tenantId: string, bucketName: string): Promise<CreateBucketCloudResponseProps>
  deleteBucket(tenantId: string, bucketName: string): Promise<void>
  getBucketDetails(tenantId: string, bucketName: string): Promise<CloudObjectItem[]>
  getObjectDetails(tenantId: string, bucketName: string, objectName: string): Promise<{ metadata: ObjectMetadata; url: string }>
  deleteObject(tenantId: string, bucketName: string, objectName: string): Promise<void>
  uploadObject(tenantId: string, bucketName: string, objectName: string, fileBuffer: Buffer): Promise<void>
}
