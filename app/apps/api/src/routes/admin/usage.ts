import { Hono } from "hono";
import { db } from "@/lib/db";
import { usage, } from "@packages/core/db/schemas/usage";
import { and, eq } from "drizzle-orm";
import { MetricProps } from "@packages/core/pricing";
import { UsageMutationPayload, UsageMutationResponse } from "@packages/types/usage"

export const adminUsageRoute = new Hono()

adminUsageRoute.get("/", async (ctx) => {
  const queryParams = ctx.req.query()
  const { id } = queryParams

  const [usages, subscription] = await Promise.all([
    db.query.usage.findMany({
      where: (usage, {and, eq}) => and(eq(usage.referenceId, id))
    }),
    db.query.subscription.findFirst({
      where: (subscription, {and, eq}) => and(eq(subscription.referenceId, id), eq(subscription.status, "active"))
    })
  ])

  return ctx.json({usages, plan: subscription?.plan ?? "free"})  
})

adminUsageRoute.post("/", async (ctx) => {
  const body = (await ctx.req.json()) as UsageMutationPayload
  
  await Promise.all([
    ...Object.keys(body.usages).map((key) => db.update(usage).set({
      count: body.usages[key as MetricProps],
      updatedAt: new Date()
    }).where(and(eq(usage.metric, key), eq(usage.referenceId, body.id))))
  ])
  return ctx.json({id: body.id, message: "Successfully updated usages", success: true} as UsageMutationResponse)  
})