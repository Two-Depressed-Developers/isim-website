import type { NextConfig } from "next";
import withRuntimeDotenv from "next-runtime-dotenv";

const runtimeDotenv = withRuntimeDotenv({
  public: ["NEXT_PUBLIC_API_URL"],
});

const nextConfig: NextConfig = runtimeDotenv({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**/*",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/public",
      },
      {
        protocol: "https",
        hostname: "strapi.mslezak.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
});

export default nextConfig;
