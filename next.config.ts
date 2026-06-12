import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root so Turbopack doesn't infer it from an unrelated
  // lockfile elsewhere on the machine (e.g. a stray pnpm-lock.yaml in $HOME).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
