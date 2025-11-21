import {z} from "zod"

const envSchema = z.object({
  VITE_API_URL: z.string(),
  VITE_BASE_URL: z.string(),
  VITE_STRIPE_PUBLISHABLE_KEY: z.string(),
})

export const env = envSchema.parse(import.meta.env)

export const config = {
  baseURL: env.VITE_BASE_URL,
  apiURL: env.VITE_API_URL,

  stripePublishableKey: env.VITE_STRIPE_PUBLISHABLE_KEY,

  env: import.meta.env.NODE_ENV ?? "development",
  isDev: import.meta.env.NODE_ENV === "development",
  isProd: import.meta.env.NODE_ENV === "production",
};
export type AppConfig = typeof config;
