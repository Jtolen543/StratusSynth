import { Hono } from "hono";
import { auth } from "@/lib/auth" // path to your auth file

export const betterAuthRoute = new Hono()

betterAuthRoute.on(["POST", "GET"], "/*", (ctx) => auth.handler(ctx.req.raw))