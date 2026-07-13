import type { NextConfig } from "next";
import path from "node:path";

// __dirname exists when Next loads this config (CJS). Under Nx's ESM graph
// loader it does not, so guard it; Nx does not use turbopack.root anyway.
const projectDir = typeof __dirname !== "undefined" ? __dirname : process.cwd();

const nextConfig: NextConfig = {
  // Pin the monorepo root so Turbopack does not guess from stray lockfiles.
  turbopack: { root: path.join(projectDir, "..", "..") },
  transpilePackages: [
    "@estatify/design-system",
    "@estatify/ui",
    "@estatify/providers",
    "@estatify/hooks",
    "@estatify/utils",
    "@estatify/auth",
    "@estatify/api-client",
    "@estatify/types",
    "@estatify/feature-property",
    "@estatify/feature-agent",
    "@estatify/feature-analytics",
    "@estatify/feature-billing",
    "@estatify/feature-branding",
    "@estatify/feature-lead",
  ],
};

export default nextConfig;
