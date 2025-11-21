import { attachAuth, requireAuth, requirePermission } from "@/middleware/auth";
import { Hono } from "hono";
import { adminAuditRoute } from "./audit";
import { adminUsageRoute } from "./usage";
import { adminSubscriptionRoute } from "./subscription";

export const adminRoute = new Hono()
adminRoute.use(attachAuth, requireAuth, requirePermission("moderator"))

adminRoute.get("/", async (ctx) => {
  return ctx.json({
    user: ctx.get("user"),
    session: ctx.get("session")
  })
})

adminRoute.route("/audit", adminAuditRoute)
adminRoute.route("/subscription", adminSubscriptionRoute)
adminRoute.route("/usage", adminUsageRoute)