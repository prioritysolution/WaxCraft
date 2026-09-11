import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  agentRules: false,
  // Scope tooling to this project root (helps avoid Turbopack/PostCSS worker crashes)
  turbopack: {
    root: path.resolve(process.cwd()),
  },
};

export default nextConfig;
