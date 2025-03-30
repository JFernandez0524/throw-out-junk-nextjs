/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // serverExternalPackages: ['@google-cloud/vertexai'], // Ensures it's loaded on the server
    serverExternalPackages: ['@google-cloud/vertex-ai'], // Ensures it's loaded on the server
  },
};

module.exports = nextConfig;
