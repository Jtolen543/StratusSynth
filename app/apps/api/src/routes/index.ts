import { Hono } from 'hono'
import { statusRoute } from './status'
import { betterAuthRoute } from "./auth"
import { usageRoute } from './usage'
import { adminRoute } from './admin'

// Import all routes here

export const routes = new Hono()

routes.route("/", statusRoute)
routes.route("/auth", betterAuthRoute)
routes.route("/usage", usageRoute)
routes.route("/admin", adminRoute)