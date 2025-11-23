import { Hono } from "hono";
import { createTenant, getTenant } from "./services/tenants";

export const tenantsRoute = new Hono()

tenantsRoute.get("/", async (ctx) => {
  const params = ctx.req.query()
  const { id } = params

  const tenant = await getTenant(id)
  return ctx.json({data: tenant})
})

tenantsRoute.post("/", async (ctx) => {
  const {name} = await ctx.req.json() as {name: string}
  const tenant = await createTenant(name)

  return ctx.json({data: tenant})
})
// tenantsRoute.post("/", async (ctx) => {
//   const {}
// })