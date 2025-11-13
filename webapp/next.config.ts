import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [`${process.env.BETTER_AUTH_URL}`]
};

export default nextConfig;
