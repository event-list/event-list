// eslint-disable-next-line @typescript-eslint/no-var-requires
const relay = require('./relay.config.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const withTM = require('next-transpile-modules')(
  ['@event-list/relay', '@event-list/ui'],
  {
    resolveSymlinks: true,
  },
);

const nextConfig = {
  swcMinify: true,
  compiler: {
    relay: {
      src: relay.src,
      artifactDirectory: relay.artifactDirectory,
      language: relay.language,
    },
    externalDir: true,
  },
  experimental: {
    runtime: 'nodejs',
    concurrentFeatures: true,
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  serverRuntimeConfig: {
    projectRoot: __dirname,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = withTM(nextConfig);
