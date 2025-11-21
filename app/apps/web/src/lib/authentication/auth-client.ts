import { createAuthClient } from "better-auth/react"
import {twoFactorClient, emailOTPClient, adminClient, apiKeyClient, jwtClient} from "better-auth/client/plugins"
import { passkeyClient } from "better-auth/client/plugins"
import { stripeClient } from "@better-auth/stripe/client"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { accessControl, adminRole, moderatorRole, ownerRole, userRole } from "@packages/core/permissions"

export const authClient = createAuthClient({
    // This will resolve to the below even if removed, but here for clarify
    baseURL: import.meta.env.VITE_API_URL,
    basePath: "/api/auth",
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
        apiKeyClient(),
        jwtClient()
    ]
})

export const protectPage = async () => {
    const navigate = useNavigate()
    const session = await authClient.getSession()
    if (!session.data) {
        toast.error("You are not logged in")
        navigate("/")
    }
}