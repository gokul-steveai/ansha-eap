import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
   experimental: {
    viewTransition: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.ucarecdn.com" },
      { protocol: "https", hostname: "**.ucarecd.net" },
      { protocol: "https", hostname: "ucarecdn.com" },
      { protocol: "https", hostname: "**.abc.net.au" },
      { protocol: "https", hostname: "**.abc-cdn.net.au" },
      { protocol: "https", hostname: "ansahealth.com.au" },
      { protocol: "https", hostname: "**.wellbeing.com.au" },
      { protocol: "https", hostname: "**.squarespace-cdn.com" },
      { protocol: "https", hostname: "watersedgecounselling.com" },
      { protocol: "https", hostname: "online.vu.edu.au" },
      { protocol: "https", hostname: "**.theconversation.com" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self'",
          },
        ],
      },
    ];
  },
};

export default withPWA({
  dest: "public",
  register: false,
  disable: !isProd, 
})(nextConfig);
