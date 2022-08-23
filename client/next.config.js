/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  devIndicators: {
    autoPrerender: true,
  },
}

module.exports = nextConfig
