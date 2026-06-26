import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@estatify/design-system", "@estatify/ui", "@estatify/providers"],
};

export default nextConfig;
