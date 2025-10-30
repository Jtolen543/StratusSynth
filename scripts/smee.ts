import SmeeClient from "smee-client";
import dotenv from "dotenv";

dotenv.config();

const smee = new SmeeClient({
    source: process.env.SMEE_URL!,
    target: `${process.env.BETTER_AUTH_URL}/api/auth/callback/github`,
    logger: console
})


smee.start();