import { z } from "zod"

const envSchema = z.object({
  BASE_URL: z.url()
})

export const env = envSchema.parse(process.env)

export const config = {
  baseURL: env.BASE_URL
}