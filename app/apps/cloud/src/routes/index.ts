import { Hono } from "hono";
import { statusRoute } from "./status";
import { authorizeRequest } from "@/middleware/service";
import { cloudBucketRoutes } from "./storage";

export const routes = new Hono()

routes.route("/", statusRoute)
routes.use(authorizeRequest)

routes.route("/bucket", cloudBucketRoutes)