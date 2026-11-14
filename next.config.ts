import type { NextConfig } from "next";

const nextConfig = {
  devIndicators: false,
  images: { unoptimized: true },
  turbopack: {
    resolveAlias: {
      "@supabase/supabase-js": "./node_modules/@supabase/supabase-js/dist/main/index.js",
    },
  },
}

export default nextConfig;
