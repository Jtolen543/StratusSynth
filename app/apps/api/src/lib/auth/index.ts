import { APIError, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP, twoFactor, phoneNumber, admin, apiKey, createAuthMiddleware, jwt } from "better-auth/plugins";
import { stripe } from "@better-auth/stripe"
import { passkey } from "@better-auth/passkey";
import { db } from "@/lib/db"
import { schemaTables } from "@packages/core/db/schemas";
import { stripeClient } from "@/lib/stripe"
import { stripeEventHandler } from "@/lib/stripe/event-handler"
import { verificationEmail, otpEmail, resetPassword } from "@/lib/resend/password";
import { usageMetrics, cyclableMetrics } from "@packages/core/pricing";
import { stripePlans } from "@/lib/stripe";
import { usage } from "@packages/core/db/schemas/usage"
import { sendChangeEmail } from "@/lib/resend/change-email";
import { addMonthsUTC, nowUTC } from "@packages/utils/date";
import { accessControl, moderatorRole, userRole, adminRole, ownerRole } from "@packages/core/permissions"
import { and, eq, inArray } from "drizzle-orm";
import { toTitle } from "@packages/utils/format"
import { createBetterAuthAudit, createRequestAudit, createStripeEventAudit } from "@/lib/audit"
import { config } from "@/config";
import { serviceClient } from "@/lib/service";
import { safeNameOrHash } from "../encrypt";
import { TenantBodyProps } from "@packages/types/tenant"

export const auth = betterAuth({
    account: {
        accountLinking: {
            enabled: true,
            trustedProviders: ["github", "google", "microsoft", "discord"]
        },

    },
    user: {
        deleteUser: {
            enabled: true,
        },
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async (data, request) => {
                await sendChangeEmail(data.newEmail, data.url)
                if (request) {
                    const event = "Email change request"
                    const detail = `Email change request from ${data.user.email} to ${data.newEmail}`
                    const description = "Email change requested from user"
                    createRequestAudit(request, {event, detail, description, status: "SUCCESS"}, data.user.id)
                }
            }
        }
    },
    databaseHooks: {
        user: {
            create: {
                after: async (user, ctx) => {
                    if (ctx) {
                        const basePath = new URL(ctx.request?.url ?? "").pathname
                        const provider = basePath?.includes("callback") ? toTitle(basePath.substring(basePath.lastIndexOf("/") + 1)) : "Email/Password"
                        const event = "User created"
                        const detail = `User created via ${provider}`
                        const description = "New user added to database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, user.id)
                    }
                    const periodStart = nowUTC()
                    const periodEnd = addMonthsUTC(periodStart, 1)

                    async function createUsage(metric: string) {
                        return db.insert(usage).values({
                            referenceId: user.id,
                            metric,
                            periodStart,
                            periodEnd,
                            count: 0,
                            updatedAt: new Date()
                        })
                    }
                    await Promise.all([
                        ...usageMetrics.map((metric) => createUsage(metric)) 
                    ])
                    
                    const cleanedUsername = safeNameOrHash(user)
                    const response = await serviceClient<TenantBodyProps>({
                        path: "tenant",
                        method: "POST",
                        body: {
                            name: cleanedUsername
                        },
                    })
                    const { data } = response
                    await db.insert(schemaTables.tenant).values({
                        name: data.displayName,
                        providerId: data.tenantId,
                        userId: user.id
                    })
                },
            },
            update: {
                after: async (user, ctx) => {
                    if (ctx) {
                        const event = "User updated"
                        const detail = "User information updated"
                        const description = "User updated in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, user.id)
                    }
                }
            },
            delete: {
                before: async (auth, ctx) => {
                    const userData = await db.query.user.findFirst({where: (user, {eq}) => eq(user.id, auth.id)})
                    await stripeClient.customers.del(userData!.stripeCustomerId as string)

                    if (ctx) {
                        const event = "User deleted"
                        const detail = "User information deleted"
                        const description = "User deleted in from database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, auth.id)
                    }
                }
            }
        },
        account: {
            create: {
                after: async(account, ctx) => {
                    if (ctx) {
                        const event = "Account created"
                        const detail = "Account information linked"
                        const description = "Account added in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, account.userId)
                    }
                }
            },
            update: {
                after: async(account, ctx) => {
                    if (ctx) {
                        const event = "Account updated"
                        const detail = "Account information updated"
                        const description = "Account updated in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, account.userId)
                    }
                }
            },
            delete: {
                after: async(account, ctx) => {
                    if (ctx) {
                        const event = "Account deleted"
                        const detail = "Account information deleted"
                        const description = "Account deleted in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, account.userId)
                    }
                }
            }
        },
        session: {
            create: {
                after: async(session, ctx) => {
                    if (ctx) {
                        const event = "Session created"
                        const detail = "New session initialized"
                        const description = "New session added in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, session.userId)
                    }
                }
            },
            update: {
                after: async(session, ctx) => {
                    if (ctx) {
                        const event = "Session updated"
                        const detail = "Session has updated"
                        const description = "Session updated in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, session.userId)
                    }
                }
            },
            delete: {
                after: async(session, ctx) => {
                    if (ctx) {
                        const event = "Session removed"
                        const detail = "Session has been removed"
                        const description = "Session deleted in database"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, session.userId)
                    }
                } 
            }
        },
    },
    hooks: {
        after: createAuthMiddleware(async (ctx) => {
            const context = ctx.context.returned

            if (context instanceof APIError) {
                const event = "Authentication Error"
                const detail = context.message
                const description = "An authentication error occured"
                createBetterAuthAudit(ctx, {event, detail, description, status: "FAILED"})
            }
        })
    },
    trustedOrigins: [config.baseURL, config.frontendURL],
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
            if (request) {
                const event = "Reset password request"
                const detail = `Password reset request created`
                const description = "Password reset created for user"
                createRequestAudit(request, {event, detail, description, status: "SUCCESS"}, user.id)
            }
        },
        onPasswordReset: async ({ user }, request) => {
            if (request) {
                const event = "Password reset"
                const detail = `Password reset finalized`
                const description = "Password reset for user"
                createRequestAudit(request, {event, detail, description, status: "SUCCESS"}, user.id)
            }
        }
    },
    emailVerification: {
      sendVerificationEmail: async ({user, url, token}, request) => {
        await verificationEmail(user, url)
            if (request) {
                const event = "Email verification sent"
                const detail = `Email verification request from user`
                const description = "Email verification sent to user"
                createRequestAudit(request, {event, detail, description, status: "SUCCESS"}, user.id)
            }
      },
      sendOnSignIn: true,
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      onEmailVerification: async (user, request) => {
            if (request) {
                const event = "Email verified"
                const detail = `Email verified for user`
                const description = "Email successfully verified"
                createRequestAudit(request, {event, detail, description, status: "SUCCESS"}, user.id)
            }
      }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        },
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!
        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID!,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET!
        }
    },
    plugins: [
        admin({
            ac: accessControl,
            roles: {
                user: userRole,
                moderator: moderatorRole,
                admin: adminRole,
                owner: ownerRole
            }
        }),
        phoneNumber(),
        emailOTP({
            otpLength: 8,
            expiresIn: 300,
            async sendVerificationOTP({email, otp, type}, ctx) {
                await otpEmail(email, otp)
                if (ctx) {
                    const event = "OTP verification sent"
                    const detail = `OTP verification sent to user`
                    const description = "OTP email sent to user"
                    createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, email)
                }
            }
        }),
        twoFactor({
            otpOptions: {
                digits: 8,
                async sendOTP ({user, otp}, ctx) {
                    await otpEmail(user.email, otp)
                    if (ctx) {
                        const event = "OTP sent"
                        const detail = "OTP sent to user"
                        const description = "OTP email sent to user"
                        createBetterAuthAudit(ctx, {event, detail, description, status: "SUCCESS"}, user.id)
                    }
                },
            }
        }),
        stripe({
            stripeClient,
            stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
            createCustomerOnSignUp: true,
            onEvent: stripeEventHandler,
            subscription: {
                enabled: true,
                plans: stripePlans,
                onSubscriptionCancel: async ({event, subscription, stripeSubscription, cancellationDetails}) => {
                    if (event) {
                        const eventName = "Subscription canceled"
                        const detail = `Stripe subscription canceled`
                        const description = "Stripe subscription scheduled for cancelation"
                        createStripeEventAudit(event, {event: eventName, detail, description, status: "SUCCESS"}, subscription.referenceId)
                    }
                },
                onSubscriptionDeleted: async ({event, stripeSubscription, subscription: currentSubscription}) => {
                    const periodStart = nowUTC()
                    const periodEnd = addMonthsUTC(periodStart, 1)
                    if (event) {
                        const eventName = "Subscription deleted"
                        const detail = `Stripe subscription deleted`
                        const description = "Stripe subscription deleted from user"
                        createStripeEventAudit(event, {event: eventName, detail, description, status: "SUCCESS"}, currentSubscription.referenceId)
                    }

                    await Promise.all([
                        db.update(usage).set({
                            count: 0,
                            periodStart,
                            periodEnd
                        }).where(and(eq(usage.referenceId, currentSubscription.referenceId), inArray(usage.metric, cyclableMetrics)))
                    ])
                },
                onSubscriptionComplete: async ({event, subscription, stripeSubscription, plan}) => {
                    if (event) {
                        const eventName = "Subscription created"
                        const detail = `Stripe subscription created with ${plan.name} plan`
                        const description = "Stripe subscription created for user"
                        createStripeEventAudit(event, {event: eventName, detail, description, status: "SUCCESS"}, subscription.referenceId)
                    }
                },
                onSubscriptionUpdate: async ({event, subscription}) => {
                    if (event) {
                        const eventName = "Subscription updated"
                        const detail = `Stripe subscription updated`
                        const description = "Stripe subscription updated for user"
                        createStripeEventAudit(event, {event: eventName, detail, description, status: "SUCCESS"}, subscription.referenceId)
                    }                    
                }
            }
        }),
        passkey(),
        apiKey(),
        jwt()
    ]
});
