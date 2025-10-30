import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config();

exec(`stripe listen --forward-to ${process.env.BETTER_AUTH_URL}/api/auth/stripe/webhook`);
console.log(`Stripe webhook exposed at ${process.env.BETTER_AUTH_URL}/api/auth/stripe/webhook`);