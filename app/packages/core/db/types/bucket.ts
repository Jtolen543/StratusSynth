import { Bucket } from "@google-cloud/storage";
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

export type ListBucketsCloudResponseProps = {
  data: Bucket[]
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

export type GCSObjectMetadata = {
  kind: "storage#object";
  id: string;
  name: string;
  selfLink: string;
  mediaLink: string;
  bucket: string;
  generation: string;
  metageneration: string;
  contentType: string;
  storageClass: string;
  size: string;
  md5Hash: string;
  crc32c: string;
  etag: string;
  temporaryHold: boolean;
  eventBasedHold: boolean;
  timeCreated: string;
  updated: string;
  timeStorageClassUpdated: string;
  timeFinalized: string;
}

export type GCSObjectData = Omit<GCSObjectMetadata, "name">

export type GetBucketCloudResponseProps = GCSObjectMetadata[]

export type BucketFileNode = {
  path: string;
  data: {
    kind: "storage#object";
    id: string;
    selfLink: string;
    mediaLink: string;
    bucket: string;
    generation: string;
    metageneration: string;
    contentType: string;
    storageClass: string;
    size: string;
    md5Hash: string;
    crc32c: string;
    etag: string;
    temporaryHold: boolean;
    eventBasedHold: boolean;
    timeCreated: string;
    updated: string;
    timeStorageClassUpdated: string;
    timeFinalized: string;
  };
  children: BucketFileNode[];
};

export type BucketFileStructure = BucketFileNode[]

export interface FormattedFileNode {
    data: {
      size: number;
      generation: number;
      metageneration: number;
      kind: "storage#object";
      id: string;
      selfLink: string;
      mediaLink: string;
      bucket: string;
      contentType: string;
      storageClass: string;
      md5Hash: string;
      crc32c: string;
      etag: string;
      temporaryHold: boolean;
      eventBasedHold: boolean;
      timeCreated: string;
      updated: string;
      timeStorageClassUpdated: string;
      timeFinalized: string;
    };
    path: string;
    children: FormattedFileNode[];
}[]

export type FormattedFileStructure = FormattedFileNode[]