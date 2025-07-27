const withPlugins = require('next-compose-plugins');
const path = require('path');
const withSvgr = require('next-plugin-svgr');
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = withPlugins([withSvgr], {
  output: 'standalone',
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  basePath: '/tourism',
  images: {
    domains: [
      '780.ir',
      'app.780.ir',
      'cdn.780.team',
      'cdn.780.ir',
      's3.780.ir',
      'hotelyar.com',
      'website-cms.780.ir',
      'public.780.ir',
    ],
  },
  sassOptions: {
    includePaths: [path.join(__dirname)],
    prependData: `
    @import "styles/_custom-variables.scss";
    @import "styles/_vars.scss";`,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tourism',
        basePath: false,
        permanent: false,
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
});

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'sentry',
  project: 'tourism-frontend',
  sentryUrl: 'https://sentry.780.ir/',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
});
