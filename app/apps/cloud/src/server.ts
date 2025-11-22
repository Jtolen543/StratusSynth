import { app } from "./app";
import { config } from "@/config";

Bun.serve({
    port: 8000,
    fetch: app.fetch,
})

console.log(`Started development server: ${config.baseURL}`)