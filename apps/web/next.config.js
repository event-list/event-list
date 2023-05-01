// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const { i18n } = require('./next-i18next.config');

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const relay = require('./relay.config.js');

// eslint-disable-next-line @typescript-eslint/no-var-requires,import/order
const withTM = require('next-transpile-modules')(['@event-list/relay', '@event-list/ui', '@event-list/flags'], {
  resolveSymlinks: true,
});

const nextConfig = {
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) => rule.test?.test?.('.svg'));

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      },
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
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
  i18n: i18n,
};

module.exports = withTM(nextConfig);
