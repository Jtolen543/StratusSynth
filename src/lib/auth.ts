import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor, phoneNumber, admin } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe"
import { passkey } from "better-auth/plugins/passkey";
import { db } from "@/db"; 
import {schemaTables} from "@/db/schemas"
import { verificationEmail, otpEmail, resetPassword } from "./resend/password";
import { usageMetrics, stripePlans } from "./stripe";
import Stripe from "stripe";
import { subscription } from "@/db/schemas/auth";
import { usage } from "@/db/schemas/plan";
import { stripeEventHandler } from "./stripe/event-handler";
import { sendChangeEmail } from "./resend/change-email";
import { addMonthsUTC, nowUTC } from "./cron/date";

export const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-08-27.basil",
    typescript: true
});

export const auth = betterAuth({
    account: {
        accountLinking: {
            enabled: true
        }
    },
    user: {
        deleteUser: {
            enabled: true,
            beforeDelete: async (user, request) => {
                const subscriptionData = await db.query.subscription.findFirst({where: (subscription, {eq}) => eq(subscription.referenceId, user.id)})
                if (!subscriptionData) throw new APIError("BAD_REQUEST", {message: "Failed to delete stripe data, please try again"})
                
                await stripeClient.customers.del(subscriptionData.stripeCustomerId as string)
                console.log("Successfully deleted stripe data")
            }
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async (data, request) => {
                await sendChangeEmail(data.newEmail, data.url)
            }
        }
    },
    trustedOrigins: [`https://${process.env.NGROK_DOMAIN}`, `${process.env.BETTER_AUTH_URL}`],
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: schemaTables
    }),
    advanced: {
        database: {
            generateId: () => crypto.randomUUID()
        }
    },
    logger: {
		disabled: false,
		disableColors: false,
		level: "error",
		log: (level, message, ...args) => {
			console.log(`[${level}] ${message}`, ...args);
		}
	},
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({user, url, token}, request) => {
            await resetPassword(user.email, url)
        },
        onPasswordReset: async ({ user }, request) => {
            console.log(`Password for user ${user.email} has been reset.`);
        },
    },
    emailVerification: {
      sendVerificationEmail: async ({user, url, token}, request) => {
        await verificationEmail(user, url)
      },
      sendOnSignUp: true,
      autoSignInAfterVerification: true
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!
        },
    },
    plugins: [
        admin(),
        phoneNumber(),
        emailOTP({
            otpLength: 8,
            expiresIn: 300,
            async sendVerificationOTP({email, otp, type}) {
                const data = await otpEmail(email, otp)
            },
        }),
        twoFactor({
            otpOptions: {
                digits: 8,
                async sendOTP ({user, otp}, request) {
                    await otpEmail(user.email, otp)
                },
            }
        }),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            async onCustomerCreate({user, stripeCustomer}, ctx) {
                const periodStart = nowUTC()
                const periodEnd = addMonthsUTC(periodStart, 1)
                const id = crypto.randomUUID()
                await db.insert(subscription).values({
                    id,
                    plan: "basic",
                    referenceId: user.id,
                    stripeCustomerId: stripeCustomer.id,
                    status: "active",
                    periodStart,
                    periodEnd,
                    seats: 1,
                })
                async function createUsage(metric: string) {
                    return db.insert(usage).values({
                        referenceId: user.id,
                        subscriptionId: id,
                        metric,
                        count: 0,
                        updatedAt: new Date()
                    })
                }
                await Promise.all([
                    ...usageMetrics.map((metric) => createUsage(metric)) 
                ])
            },
            onEvent: stripeEventHandler,
            subscription: {
                enabled: true,
                plans: stripePlans,
            }
        }),
        passkey()
    ]
});