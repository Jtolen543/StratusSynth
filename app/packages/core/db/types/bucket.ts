import { bucket } from "../schemas/bucket"

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

export type ListBucketsAPIResponseProps = {
  data: typeof bucket.$inferSelect[]
}

export type GetBucketAPIResponseProps = {
  data: BucketFileStructureData
}

export type BucketFileStructureData = {
  children: BucketFileStructure;
  tenantId: string;
  name: string;
  uri: string;
  location: string;
  storageClass: string;
  locationType: string;
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  size: number | null;
}

export type ObjectMetadata = {
  name: string;
  size: number;
  contentType: string;
  storageClass: string;
  createdAt: string;
  updatedAt: string;
  etag: string;
  md5Hash: string;
}

export type CloudObjectItem = {
  name: string;
  size: number;
  contentType: string;
  storageClass: string;
  createdAt: string;
  updatedAt: string;
}

export type GetBucketCloudResponseProps = CloudObjectItem[]

export type ObjectMeta = {
  size: number;
  contentType: string;
  storageClass: string;
  createdAt: string;
  updatedAt: string;
}

export type BucketFileNode = {
  path: string;
  relativePath: string;
  data: ObjectMeta;
  children: BucketFileNode[];
};

export type BucketFileStructure = BucketFileNode[]

export type FormattedFileNode = BucketFileNode
export type FormattedFileStructure = BucketFileStructure