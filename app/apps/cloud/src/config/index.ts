import { z } from "zod"

interface GCPServiceAccountFormat {
    type?: string;
    client_email?: string;
    private_key?: string;
    private_key_id?: string;
    project_id?: string;
    client_id?: string;
    client_secret?: string;
    refresh_token?: string;
    quota_project_id?: string;
    universe_domain?: string;
}

const envSchema = z.object({
  BASE_URL: z.url(),
  API_URL: z.url(),
  FRONTEND_URL: z.url(),
  NODE_ENV: z.string(),
  CLOUD_GCP_PROJECT_NAME: z.string(),
  CLOUD_GCP_PROJECT_ID: z.string(),
  GCP_SERVICE_ACCOUNT: z.string(),
  SERVICE_API_KEY: z.string()
})

export const env = envSchema.parse(process.env)

const environment = env.NODE_ENV.toLowerCase() === "development" ? "dev" : env.NODE_ENV.toLowerCase() === "production" ? "prod" : "test"

export const config = {
  baseURL: env.BASE_URL,
  apiURL: env.API_URL,
  frontendURL: env.FRONTEND_URL,
  environment,
  cloud: {
    serviceKey: env.SERVICE_API_KEY,
    GCP: {
      projectID: env.CLOUD_GCP_PROJECT_ID,
      projectName: env.CLOUD_GCP_PROJECT_NAME,
      serviceAccount: JSON.parse(env.GCP_SERVICE_ACCOUNT) as GCPServiceAccountFormat
    },
    AWS: {},
    Azure: {}
  }
}