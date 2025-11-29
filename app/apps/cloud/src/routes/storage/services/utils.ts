import { config } from "@/config"
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