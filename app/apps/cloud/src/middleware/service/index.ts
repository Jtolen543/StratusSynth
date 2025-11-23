import { config } from "@/config"
import { createMiddleware } from "hono/factory"
import { HTTPException } from "hono/http-exception"

export const authorizeRequest = createMiddleware(async (ctx, next) => {
  const req = ctx.req

  if (req.header("X-Service-API-Key") !== config.cloud.serviceKey) {
    throw new HTTPException(401, {
      message: "Unauthorized access to cloud services",
      cause: "Must provide a service key to authenticate requests",
      res: ctx.res
    })
  }
  await next()
})