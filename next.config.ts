import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure to externalize packages that should not be bundled
  serverExternalPackages: ['pino', 'thread-stream', 'better-sqlite3'],
  // Add empty turbopack config to silence the warning about webpack config with Turbopack
  turbopack: {},
  webpack: (config, { isServer }) => {
    // Add IgnorePlugin to exclude problematic test files
    const webpack = require('webpack');

    config.plugins = config.plugins || [];

    config.plugins.push(
      new webpack.IgnorePlugin({
        checkResource(resource: string, context: string) {
          // Ignore test files, bench files, and non-code files from thread-stream
          if (context.includes('thread-stream') || resource.includes('thread-stream')) {
            if (
              resource.includes('/test/') ||
              resource.includes('.test.') ||
              resource.includes('.spec.') ||
              resource.includes('bench') ||
              resource.endsWith('.md') ||
              resource.endsWith('.txt') ||
              resource.includes('LICENSE') ||
              resource.includes('/test')
            ) {
              return true;
            }
          }
          return false;
        },
      })
    );

    // Externalize better-sqlite3 for server-side
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('better-sqlite3');
      }
    }

    return config;
  },
};

export default nextConfig;
