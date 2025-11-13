import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/authentication/auth'

export default async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    const session = await auth.api.getSession({
        headers: Object.fromEntries(request.headers)
    })

    if (!session) {
        const redirectURL = new URL("/signin", request.url)
        redirectURL.searchParams.set("next", pathname)
        return NextResponse.redirect(redirectURL)
    }

    if (pathname.startsWith("/admin") && session.user.role === "user") {
        const redirectURL = new URL("/", request.url)
        redirectURL.searchParams.set("next", pathname)
        return NextResponse.redirect(redirectURL)
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/profile/:path*", "/admin/:path*"]
}