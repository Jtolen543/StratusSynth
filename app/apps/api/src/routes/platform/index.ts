import { attachTenant } from "@/middleware/service";
import { Hono } from "hono";
import { platformStorageRoutes } from "./storage";

export const platformRoutes = new Hono()

platformRoutes.use(attachTenant)

platformRoutes.route("/storage", platformStorageRoutes)