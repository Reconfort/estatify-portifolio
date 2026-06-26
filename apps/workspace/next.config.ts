import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Pin the monorepo root so Turbopack stops guessing from stray lockfiles.
  turbopack: { root: path.join(__dirname, "..", "..") },
  transpilePackages: [
    "@estatify/design-system",
    "@estatify/ui",
    "@estatify/providers",
    "@estatify/hooks",
    "@estatify/utils", "@estatify/feature-property", "@estatify/feature-agent", "@estatify/feature-analytics", "@estatify/feature-billing", "@estatify/feature-branding", "@estatify/feature-lead"
  ],
};

export default nextConfig;
