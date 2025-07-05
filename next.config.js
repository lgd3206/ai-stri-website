/** @type {import('next').NextConfig} */
const nextConfig = {
  // 完全跳过ESLint检查
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 跳过TypeScript检查
  typescript: {
    ignoreBuildErrors: true,
  },
  // 禁用严格模式避免额外检查
  reactStrictMode: false,
};

module.exports = nextConfig;
