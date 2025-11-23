import { Hono } from "hono";
import { tenantsRoute } from "./tenants";
import { statusRoute } from "./status";
import { authorizeRequest } from "@/middleware/service";

export const routes = new Hono()

routes.route("/", statusRoute)

routes.use(authorizeRequest)
routes.route("/tenant", tenantsRoute)
