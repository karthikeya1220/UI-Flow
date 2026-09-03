import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  images: {
    domains: [
      'wdzlvxpugvcinfqizleu.supabase.co' // Your Supabase project domain
    ]
  }
};

export default nextConfig;
