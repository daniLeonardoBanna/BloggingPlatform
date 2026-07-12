import type { NextConfig } from "next";

// Server-side fetches (Server Components) call the backend directly.
// Client-side fetches (e.g. expanding replies) call the relative /api/v1
// path below, which this rewrite proxies to the backend — this avoids
// needing the backend's CORS_ORIGINS to know about the frontend's port.
const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN || "http://localhost:3000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${BACKEND_ORIGIN}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
