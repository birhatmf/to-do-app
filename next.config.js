/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Production optimizations
  poweredByHeader: false,
  compress: true,

  // Environment variables exposed to the browser
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },

  // Logging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
