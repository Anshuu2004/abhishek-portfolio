import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  // The chat route reads data/rag-index.json via a runtime path
  // (path.join(process.cwd(), ...)), which Next's file tracing can't detect
  // statically. Without this, the index is missing from the deployed function
  // and the agent silently falls back to demo mode in production.
  outputFileTracingIncludes: {
    "/api/chat": ["./data/rag-index.json"],
  },
};

export default nextConfig;
