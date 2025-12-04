import { Bucket } from "@google-cloud/storage";
import { bucket } from "@packages/core/db/schemas/platform/storage";

export type CreateBucketAPIResponseProps = {
  tenantId: string;
  name: string;
  uri: string;
  location: string;
  storageClass: string;
  locationType: string;
}

export type CreateBucketCloudResponseProps = {
  name: string;
  uri: string;
  storageClass: string;
  location: string;
  locationType: string;
}

export type ListBucketsCloudResponseProps = {
  data: Bucket[]
}

export type ListBucketsAPIResponseProps = {
  data: typeof bucket.$inferSelect[]
}

export type GetBucketCloudResponseProps = {
  data: Bucket
}