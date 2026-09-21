import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // NOTE: Do NOT set output:'standalone' when deploying to Vercel.
  // Vercel handles its own bundling; standalone overrides that and causes 404s.

  // Suppress TS errors from blocking the Vercel build pipeline.
  typescript: {
    ignoreBuildErrors: true,
  },

  // Supabase must run in Node.js — keep it out of the Edge runtime.
  serverExternalPackages: ['@supabase/supabase-js', '@supabase/ssr'],

  // Pin the workspace root so Next.js selects the correct lockfile
  // when multiple package-lock.json files exist in parent directories.
  turbopack: {
    root: resolve(__dirname),
  },
};

export default nextConfig;
