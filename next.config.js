const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '',
  trailingSlash: true,
  experimental: {
    turbotrace: {
      enabled: true,
    },
  },
  webpack: (config, { isServer }) => {
    // TypeScript 관련 설정 추가
    config.resolve.extensions.push('.ts', '.tsx');
    
    // 절대 경로 설정
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };

    return config;
  },
  distDir: process.env.NODE_ENV === 'development' ? '.next' : 'out',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  }
}

module.exports = nextConfig 