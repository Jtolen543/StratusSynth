import { z } from "zod"

const envSchema = z.object({
  BASE_URL: z.url(),
  API_URL: z.url(),
  FRONTEND_URL: z.url()
})

export const env = envSchema.parse(process.env)

export const config = {
  baseURL: env.BASE_URL,
  apiURL: env.API_URL,
  frontendURL: env.FRONTEND_URL
}