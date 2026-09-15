import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static. No server, no Vercel-specific features; deploy the `out/` folder anywhere.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  turbopack: { root: __dirname },
  agentRules: false,
};

export default nextConfig;
