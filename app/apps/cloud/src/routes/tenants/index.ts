import { Hono } from "hono";
import { createTenant, deleteTenant, getTenant, updateTenant } from "./services/tenants";

export const tenantsRoute = new Hono()

tenantsRoute.get("/", async (ctx) => {
  const params = ctx.req.query()
  const { id } = params

  const tenant = await getTenant(id)
  return ctx.json({data: tenant})
})

tenantsRoute.post("/", async (ctx) => {
  const body = await ctx.req.json()
  const { name } = body
  const tenant = await createTenant(name as string)

  return ctx.json({data: tenant})
})

tenantsRoute.delete("/", async (ctx) => {
  const params = ctx.req.query()
  const { id } = params

  await deleteTenant(id)
  return ctx.json({data: "Successfully removed tenant"})
})

tenantsRoute.patch("/", async (ctx) => {
  const body = await ctx.req.json()
  const { name } = body as {name: string}

  const tenant = await updateTenant(name)
  return ctx.json({data: tenant})
})