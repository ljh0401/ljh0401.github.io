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
  distDir: process.env.NODE_ENV === 'development' ? '.next' : 'out',
  generateBuildId: async () => {
    return 'build-' + Date.now();
  }
}

module.exports = nextConfig 