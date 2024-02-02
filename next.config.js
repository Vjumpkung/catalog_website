/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    JWT_NAME: process.env.JWT_NAME,
  },
};

module.exports = nextConfig;
