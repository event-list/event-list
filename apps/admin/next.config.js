// eslint-disable-next-line @typescript-eslint/no-var-requires
const relay = require('./relay.config.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const withTM = require('next-transpile-modules')(['@event-list/relay', '@event-list/ui'], {
  resolveSymlinks: true,
});

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
  publicRuntimeConfig: {
    S3_UPLOAD_KEY: process.env.S3_UPLOAD_KEY,
    S3_UPLOAD_SECRET: process.env.S3_UPLOAD_SECRET,
    S3_UPLOAD_REGION: process.env.S3_UPLOAD_REGION,
    S3_UPLOAD_BUCKET: process.env.S3_UPLOAD_BUCKET,
  },
};

module.exports = withTM(nextConfig);
