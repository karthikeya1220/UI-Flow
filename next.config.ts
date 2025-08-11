import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [
      'firebasestorage.googleapis.com', // Keep Firebase domains for backward compatibility
      'wdzlvxpugvcinfqizleu.supabase.co' // Your Supabase project domain
    ]
  }
};

export default nextConfig;
