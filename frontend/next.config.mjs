// next.config.js
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://vectorquerycorns.org/api/:path*",
      },
    ];
  },
};
export default nextConfig;