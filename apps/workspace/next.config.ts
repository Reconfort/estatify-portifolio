import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@estatify/design-system",
    "@estatify/ui",
    "@estatify/providers",
    "@estatify/feature-property",
    "@estatify/feature-agent",
    "@estatify/feature-analytics",
  ],
};

export default nextConfig;
