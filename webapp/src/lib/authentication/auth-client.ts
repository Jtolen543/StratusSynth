import { createAuthClient } from "better-auth/react"
import {twoFactorClient, emailOTPClient, adminClient, apiKeyClient} from "better-auth/client/plugins"
import { passkeyClient } from "better-auth/client/plugins"
import { stripeClient } from "@better-auth/stripe/client"
import { redirect } from "next/navigation"
import { toast } from "sonner"
import { accessControl, adminRole, moderatorRole, ownerRole, userRole } from "./permissions"

export const authClient = createAuthClient({
    // This will resolve to the below even if removed, but here for clarify
    baseURL: process.env.BETTER_AUTH_URL,
    basePath: "/api/auth",
    secret: process.env.BETTER_AUTH_SECRET,
    plugins: [
        adminClient({
            ac: accessControl,
            roles: {
                user: userRole,
                moderator: moderatorRole,
                admin: adminRole,
                owner: ownerRole
            }
        }),
        twoFactorClient({
            onTwoFactorRedirect() {
                window.location.href = "/2FA"
            },
        }),
        emailOTPClient(),
        passkeyClient(),
        stripeClient({
            subscription: true,
        }),
        apiKeyClient()
    ]
})

export const protectPage = async () => {
    const session = await authClient.getSession()
    if (!session.data) {
        toast.error("You are not logged in")
        redirect("/")
    }
}