import { useAdminSession } from "@/hooks/use-admin-route";
import { authClient } from "./auth-client";
import { Navigate } from "react-router";
import { LoadingScreen } from "@/components";

export function ProtectedRoute({children}: {children: React.ReactNode}) {
    const { data, isPending } = authClient.useSession()
    
    const user = data?.user
    const session = data?.session

    if (isPending) return <LoadingScreen />

    if (!user || !session) return <Navigate to="/signin" replace />

    return <>{children}</>
}

export function AdminRoute({children}: {children: React.ReactNode}) {
    const { user, session, isLoading } = useAdminSession()

    if (isLoading) return <LoadingScreen />

    if (!session || !user) return <Navigate to="/" />

    return <>{children}</>
}