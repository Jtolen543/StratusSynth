import { config } from "@/config"
import { Bucket } from "@google-cloud/storage"
import { HTTPException } from "hono/http-exception"

export function getBucketPath(tenantId: string, bucketName?: string) {
    let basePath = `${config.environment}-app-${tenantId}`
    if (bucketName) basePath += `-${bucketName}`

    if (basePath.length < 3 || basePath.length > 63) throw new HTTPException(400, {
        cause: "Invalid bucket name",
        message: "Bucket name must be at most 18 characters long"
    })

    return basePath
}

export async function getBucketMetaInformation(bucket: Bucket, bucketName: string) {
    const metaData = (await bucket.getMetadata())[0]
    const metaInformation = {
        name: bucketName,
        uri: bucket.cloudStorageURI.href,
        storageClass: metaData.storageClass!,
        location: metaData.location!,
        locationType: metaData.locationType!,
    }
    return metaInformation
}