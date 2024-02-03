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
    CLOUDINARY_UPLOAD_PROFILE: process.env.CLOUDINARY_UPLOAD_PROFILE,
  },
};

module.exports = nextConfig;
