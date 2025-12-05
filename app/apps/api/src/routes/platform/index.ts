import { attachTenant } from "@/middleware/service";
import { Hono } from "hono";
import { platformBucketRoutes } from "./storage";
import { attachAuth, requireAuth } from "@/middleware/auth";

export const platformRoutes = new Hono()

platformRoutes.use(attachAuth, requireAuth, attachTenant)

platformRoutes.route("/storage", platformBucketRoutes)