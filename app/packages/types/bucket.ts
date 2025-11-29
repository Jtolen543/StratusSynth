import { CreateBucketResponse, GetBucketsResponse, Bucket } from "@google-cloud/storage";

export type CreateBucketResponseProps = {
  data: CreateBucketResponse
}

export type GetBucketsResponseProps = {
  data: GetBucketsResponse
}

export type GetBucketResponseProps = {
  data: Bucket
}