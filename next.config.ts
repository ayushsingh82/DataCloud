import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure to externalize pino and its dependencies to avoid bundling issues
  serverExternalPackages: ['pino', 'thread-stream'],
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

    return config;
  },
};

export default nextConfig;
