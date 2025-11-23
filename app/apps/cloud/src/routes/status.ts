import { Hono } from "hono";

export const statusRoute = new Hono()

statusRoute.get("/", (ctx) => {
    return ctx.json({message: "GET method is successful"})
})

statusRoute.post("/", (ctx) => {
    return ctx.json({message: "POST method is successful"})
})

statusRoute.put("/", (ctx) => {
    return ctx.json({message: "PUT method is successful"})
})

statusRoute.patch("/", (ctx) => {
    return ctx.json({message: "PATCH method is successful"})
})

statusRoute.delete("/", (ctx) => {
    return ctx.json({message: "DELETE method is successful"})
})