import { Hono } from "hono";
import { statusRoute } from "./status";
import { authorizeRequest } from "@/middleware/service";
import { cloudStorageRoutes } from "./storage";

export const routes = new Hono()

routes.route("/", statusRoute)
routes.use(authorizeRequest)

routes.route("/storage", cloudStorageRoutes)