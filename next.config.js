const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/ljh0401.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/ljh0401.github.io/' : '',
  trailingSlash: true,
  experimental: {
    turbotrace: {
      enabled: false,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, '.'),
    };
    return config;
  },
  distDir: process.env.NODE_ENV === 'development' ? '.next' : 'out',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  }
}

module.exports = nextConfig 