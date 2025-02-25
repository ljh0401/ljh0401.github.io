const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '',
  assetPrefix: '',
  trailingSlash: true,
  experimental: {
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, '.'),
    };
    // TypeScript 관련 설정 추가
    config.resolve.extensions = ['.ts', '.tsx', '.js', '.jsx', ...config.resolve.extensions];
    return config;
  },
  distDir: process.env.NODE_ENV === 'development' ? '.next' : 'out',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
}

module.exports = nextConfig 