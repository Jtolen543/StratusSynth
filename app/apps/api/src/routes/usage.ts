import { Hono } from "hono";
import { db } from "@/lib/db";
import { attachAuth, requireAuth } from "@/middleware/auth";

export const usageRoute = new Hono()
usageRoute.use(attachAuth, requireAuth)

usageRoute.get("/", async (ctx) => {
  const user = ctx.get("user")!

  const [usageData, subscriptionData] = await Promise.all([
    db.query.usage.findMany({where: (usage, { eq }) => eq(usage.referenceId, user.id)}), 
    db.query.subscription.findFirst({where: (subscription, {and, eq}) => and(eq(subscription.referenceId, user.id), eq(subscription.status, "active"))})
  ])

  const body = {
    usages: usageData,
    plan: subscriptionData?.plan ?? "free"
  }
  
  return ctx.json(body)
})