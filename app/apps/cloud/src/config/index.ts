import { z } from "zod"

const envSchema = z.object({
  BASE_URL: z.url(),
  API_URL: z.url(),
  FRONTEND_URL: z.url(),
  NODE_ENV: z.string(),
  CLOUD_PROJECT_NAME: z.string(),
  CLOUD_PROJECT_ID: z.string(),
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
    projectID: env.CLOUD_PROJECT_ID,
    projectName: env.CLOUD_PROJECT_NAME
  }
}