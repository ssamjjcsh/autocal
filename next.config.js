import { fileURLToPath } from 'url';
import path, { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname : ''],
  },
  env: {
    NEXT_PUBLIC_UPSTASH_REDIS_REST_URL: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL,
    NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN,
  },
  output: 'standalone',

  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },
};

export default nextConfig;
