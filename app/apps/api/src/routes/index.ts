import { Hono } from 'hono'
import { statusRoute } from './api/status'
import { betterAuthRoute } from "./api/auth"
import { usageRoute } from './api/usage'
import { adminRoutes } from './admin'
import { cronJobRouter } from './api/cron'
import { platformRoutes } from './platform'

export const APIRoutes = new Hono()

APIRoutes.route("/", statusRoute)
APIRoutes.route("/auth", betterAuthRoute)
APIRoutes.route("/usage", usageRoute)
APIRoutes.route("/admin", adminRoutes)
APIRoutes.route("/cron", cronJobRouter)
APIRoutes.route("/platform", platformRoutes)
