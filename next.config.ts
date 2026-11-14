/** @type {import('next').NextConfig} */
import { fileURLToPath } from "node:url"
import { existsSync } from "node:fs"

const supabaseCommonJsEntry = fileURLToPath(
  new URL("./node_modules/@supabase/supabase-js/dist/main/index.js", import.meta.url),
)

const nextConfig = {
  devIndicators: false,
  images: { unoptimized: true },
  webpack: (config) => {
    if (existsSync(supabaseCommonJsEntry)) {
      config.resolve.alias["@supabase/supabase-js$"] = supabaseCommonJsEntry
    }
    return config
  },
}

export default nextConfig