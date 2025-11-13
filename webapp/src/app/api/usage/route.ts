import { db } from "@/db";
import { auth } from "@/lib/authentication/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { nowUTC, addMonthsUTC } from "@/lib/cron/date";
import { usage } from "@/db/schemas/usage";
import { cyclableMetrics } from "@/lib/stripe";
import { inArray, sql } from "drizzle-orm";

export async function GET() {
  const data = await auth.api.getSession({
    headers: await headers()
  })
  if (!data || !data?.session || !data.session) return NextResponse.json({message: "Invalid headers"})

  const {user} = data

  const [usageData, subscriptionData] = await Promise.all([
    db.query.usage.findMany({where: (usage, {and, eq}) => and(eq(usage.referenceId, user.id), inArray(usage.metric, cyclableMetrics))}), 
    db.query.subscription.findFirst({where: (subscription, {and, eq}) => and(eq(subscription.referenceId, user.id), eq(subscription.status, "active"))})
  ])

  if (usageData.length === 0) throw new Error("No usage information available")

  const {periodStart, periodEnd} = usageData[0]
  const currentPeriodStart = nowUTC()
  const currentPeriodEnd = addMonthsUTC(currentPeriodStart, 1)    

  // If the plan is on the free tier and the current time is greater than the stored period end, meaning it has lapsed
  if (!subscriptionData && periodStart !== currentPeriodStart && currentPeriodStart >= periodEnd!) {
    const shouldCycle = cyclableMetrics.length ? inArray(usage.metric, cyclableMetrics) : sql`false`;
      await db.update(usage).set({
        periodStart: currentPeriodStart,
        periodEnd: currentPeriodEnd,
        count: sql`case when ${shouldCycle} then 0 else ${usage.count} end`
      })
  }
  
  async function getUsages() {
    const usages = await db.query.usage.findMany({
      where: (usage, {eq}) => eq(usage.referenceId, user.id),
    })
    return usages.sort((a, b) => a.metric.localeCompare(b.metric))
  }

  const [usages, plan] = await Promise.all([getUsages(), subscriptionData?.plan ?? "free"])
  return NextResponse.json({usages, plan})
}