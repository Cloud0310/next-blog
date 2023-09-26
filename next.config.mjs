/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "export",
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
