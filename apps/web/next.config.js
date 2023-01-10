// eslint-disable-next-line @typescript-eslint/no-var-requires
const relay = require('./relay.config.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const withTM = require('next-transpile-modules')(['@finn/relay', '@finn/ui'], {
  resolveSymlinks: true,
});

const nextConfig = {
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
