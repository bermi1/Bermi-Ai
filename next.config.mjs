/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  },
  // In production every /api/* request is handled by the FastAPI serverless
  // function at api/index.py (same pattern as Vercel's nextjs-fastapi template).
  async rewrites() {
    return [{ source: "/api/:path*", destination: "/api/index" }];
  },
};

export default nextConfig;
