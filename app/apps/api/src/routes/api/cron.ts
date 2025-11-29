import { subscription } from "@packages/core/db/schemas/auth";
import { cyclableMetrics } from "@packages/core/pricing"
import { usage } from "@packages/core/db/schemas/usage";
import { addMonthsUTC, nowUTC } from "@packages/utils/date";
import { and, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { Hono } from "hono";

export const cronJobRouter = new Hono()

cronJobRouter.get("/", async (ctx) => {
  const freeTierUsers = await db.query.user.findMany({
      with: {
          usage: true,
          subscription: true
      },
      where: (user, {or, eq, inArray, notExists, and}) => or(
          notExists(db.select().from(subscription).where(eq(subscription.referenceId, user.id))),
          notExists(db.select().from(subscription).where(and(eq(subscription.id, user.id), inArray(subscription.status, ["active", "trialing"]))))
      )
  })

  const now = nowUTC()

  const newPeriodStart = now
  const newPeriodEnd = addMonthsUTC(newPeriodStart, 1)
  
  type UsageRowProps = (typeof usage.$inferSelect)
  type FreeTierRow = (typeof freeTierUsers)[number]

  const filteredMetrics = freeTierUsers.reduce<UsageRowProps[]>((res, user: FreeTierRow) => {
      const testMetric = user.usage[0]
      
      const periodStart = testMetric.periodStart
      const periodEnd = testMetric.periodEnd

      if (periodStart !== now && periodEnd < now) {
          return [...res, ...user.usage]
      } else return res
  }, [])
  
  async function resetUsages(row: UsageRowProps) {
      return db.update(usage).set({
          periodStart: newPeriodStart,
          periodEnd: newPeriodEnd,
          count: sql`CASE WHEN ${inArray(usage.metric, cyclableMetrics)} THEN 0 ELSE ${usage.count} END`
      }).where(and(eq(usage.referenceId, row.referenceId), eq(usage.metric, row.metric)))
  }

  await Promise.all([ ...filteredMetrics.map((obj) => resetUsages(obj)) ])
  return ctx.json({message: "Reset completed processing. All users with cycled subscriptions will now be refreshed for the month"})
})