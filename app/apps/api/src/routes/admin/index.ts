import { attachAuth, requireAuth, requirePermission } from "@/middleware/auth";
import { Hono } from "hono";
import { adminAuditRoute } from "./audit";
import { adminUsageRoute } from "./usage";
import { adminSubscriptionRoute } from "./subscription";

export const adminRoutes = new Hono()
adminRoutes.use(attachAuth, requireAuth, requirePermission("moderator"))

adminRoutes.get("/", async (ctx) => {
  return ctx.json({
    user: ctx.get("user"),
    session: ctx.get("session")
  })
})

adminRoutes.route("/audit", adminAuditRoute)
adminRoutes.route("/subscription", adminSubscriptionRoute)
adminRoutes.route("/usage", adminUsageRoute)