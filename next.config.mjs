/** @type {import('next').NextConfig} */
import { fileURLToPath } from "node:url"

const supabaseCommonJsEntry = fileURLToPath(
  new URL("./node_modules/@supabase/supabase-js/dist/main/index.js", import.meta.url),
)

const nextConfig = {
  // Next 16.1's development DevTools crashes while building the route explorer
  // for this App Router project. This only disables the development indicator;
  // it does not affect the application or production builds.
  devIndicators: false,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    // Supabase 2.87's ESM wrapper is incompatible with Webpack's resolver in
    // this Next release. Its CommonJS entry exposes the same public API.
    config.resolve.alias["@supabase/supabase-js$"] = supabaseCommonJsEntry
    return config
  },
}

export default nextConfig
