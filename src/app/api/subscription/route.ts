import { db } from "@/db";
import { auth } from "@/lib/auth";
import { APIError } from "better-auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { nowUTC, addMonthsUTC } from "@/lib/cron/date";
import { subscription } from "@/db/schemas/auth";

// This is temporary until you actually need to create a CRON job

export async function GET(request: NextRequest) {
    const body = await auth.api.getSession({
        headers: await headers()
    })
    if (!body) throw new APIError("UNAUTHORIZED", {message: "Invalid request headers", code: "401"})
    
    const {session, user} = body

    const subscriptionData = await db.query.subscription.findFirst({
        where: (subscription, {eq}) => eq(subscription.referenceId, user.id)
    })

    if (!subscriptionData) throw new APIError("NOT_FOUND", {message: "Subscription information not found", code: "404"})

    const {periodStart, periodEnd, plan} =  subscriptionData
    const currentPeriodStart = nowUTC()
    const currentPeriodEnd = addMonthsUTC(currentPeriodStart, 1)    

    // If the plan is on the free tier and the current time is greater than the stored period end, meaning it has lapsed
    if (plan === "basic" && currentPeriodStart >= periodEnd! && periodStart !== currentPeriodStart) {
        await db.update(subscription).set({
            periodStart: currentPeriodStart,
            periodEnd: currentPeriodEnd
        })
        // Add something later for when you wanna have resettable services, like deployments or smth
    }
    const data = await auth.api.listActiveSubscriptions({
        headers: await headers()
    })
    return NextResponse.json(data)
}