import { Hono } from "hono";
import { cloudTenantsRoutes } from "./tenants";

export const cloudRoutes = new Hono()

cloudRoutes.route("/tenant", cloudTenantsRoutes)