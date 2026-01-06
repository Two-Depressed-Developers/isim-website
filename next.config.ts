import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  reactStrictMode: false,
  reactCompiler: true,
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "1337",
        pathname: "/uploads/**",
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
};

export default withNextIntl(nextConfig);
