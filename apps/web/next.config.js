/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    relay: {
      src: './',
      language: 'typescript',
      artifactDirectory: '__generated__'
    }
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  experimental: {
    transpilePackages: ["@event-list/ui"],
  },
}

module.exports = nextConfig
