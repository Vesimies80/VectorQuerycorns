/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",                     // any request to /api/xyz
        destination: "https://vectorquerycorns.org/api/:path*", // proxy to FastAPI
      },
    ];
  },
};

export default nextConfig;


