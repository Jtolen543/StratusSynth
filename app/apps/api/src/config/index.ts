import {z} from "zod"

const envSchema = z.object({
  BETTER_AUTH_URL: z.url(),
  FRONTEND_BASE_URL: z.url(),
  CLOUD_SERVER_URL: z.url(),
  BETTER_AUTH_SECRET: z.string(),
  SERVICE_API_KEY: z.string(),
  RESEND_DOMAIN_ADDRESS: z.string(),
  RESEND_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_CLIENT_SECRET: z.string(),
  MICROSOFT_CLIENT_ID: z.string(),
  MICROSOFT_CLIENT_SECRET: z.string(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_HOBBY_MONTHLY_ID: z.string(),
  STRIPE_HOBBY_ANNUAL_ID: z.string(),
  STRIPE_DEVELOPER_MONTHLY_ID: z.string(),
  STRIPE_DEVELOPER_ANNUAL_ID: z.string(),
  STRIPE_TEAM_MONTHLY_ID: z.string(),
  STRIPE_TEAM_ANNUAL_ID: z.string()
})

export const env = envSchema.parse(process.env)

export const config = {
  baseURL: env.BETTER_AUTH_URL,
  frontendURL: env.FRONTEND_BASE_URL,
  cloudURL: env.CLOUD_SERVER_URL,

  serviceAPIKey: env.SERVICE_API_KEY,
  authSecret: env.BETTER_AUTH_SECRET,
  resendApiKey: env.RESEND_API_KEY,
  databaseUrl: env.DATABASE_URL,

  oauth: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
    microsoft: {
      clientId: env.MICROSOFT_CLIENT_ID,
      clientSecret: env.MICROSOFT_CLIENT_SECRET,
    },
  },

  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,

    plans: {
      hobby: {
        monthly: env.STRIPE_HOBBY_MONTHLY_ID,
        annual: env.STRIPE_HOBBY_ANNUAL_ID,
      },
      developer: {
        monthly: env.STRIPE_DEVELOPER_MONTHLY_ID,
        annual: env.STRIPE_DEVELOPER_ANNUAL_ID,
      },
      team: {
        monthly: env.STRIPE_TEAM_MONTHLY_ID,
        annual: env.STRIPE_TEAM_ANNUAL_ID,
      },
    },
  },

  resend: {
    domain: env.RESEND_DOMAIN_ADDRESS,
    apiKey: env.RESEND_API_KEY,
  },

  env: process.env.NODE_ENV ?? "development",
  isDev: process.env.NODE_ENV === "development",
  isProd: process.env.NODE_ENV === "production",
};
export type AppConfig = typeof config;
