/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // ✅ Enable SSR support
  reactStrictMode: true,
  trailingSlash: true,
  // other config options...
};

module.exports = nextConfig;
