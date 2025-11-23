import { routes } from "./routes";
import { Hono } from "hono";
import { cors } from 'hono/cors'
import { logger } from "hono/logger"
import { config } from "@/config";
import { HTTPException } from "hono/http-exception";

export const app = new Hono()

app.use("/*", cors({
    origin: [config.frontendURL, config.baseURL, config.apiURL],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    credentials: true
}))

app.use(logger())

app.route("/cloud", routes)

app.notFound((ctx) => {
    console.error("Unknown endpoint, please check your URL and try again.")
    return ctx.json({ error: "Unknown endpoint, please enter a valid URL" }, 404)
})

app.onError((err, ctx) => {
    console.error(err);
    if (err instanceof HTTPException) {
        return ctx.json({ error: err.message, cause: err.cause, name: err.name }, err.status);
    } else return ctx.json({ error: err.message, cause: err.cause, name: err.name }, 500)
})

