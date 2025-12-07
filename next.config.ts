import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "via.placeholder.com",
      },
      {
        protocol: "https",
        hostname: "www.api.bfb.projection-learn.website",
      },
      {
        protocol: "https",
        hostname: "www.api.bfb.in.ua",
      },
      {
        protocol: "https",
        hostname: "secure.gravatar.com",
      },
      {
        protocol: "https",
        hostname: "gravatar.com",
      },
    ],
    unoptimized: false,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  turbopack: {
    root: process.cwd(),
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  /* config options here */
};

export default nextConfig;
