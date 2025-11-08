/**
 * CRACO Configuration for Performance Optimization
 * Overrides Create React App webpack config without ejecting
 */

const webpack = require('webpack');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // Production optimizations
      if (env === 'production') {
        // Enable gzip compression
        webpackConfig.plugins.push(
          new CompressionPlugin({
            filename: '[path][base].gz',
            algorithm: 'gzip',
            test: /\.(js|css|html|svg)$/,
            threshold: 10240,
            minRatio: 0.8,
          })
        );

        // Optimize chunk splitting
        webpackConfig.optimization = {
          ...webpackConfig.optimization,
          splitChunks: {
            chunks: 'all',
            cacheGroups: {
              // Vendor chunk for node_modules
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: 10,
                reuseExistingChunk: true,
              },
              // Auth0 in separate chunk (large library)
              auth0: {
                test: /[\\/]node_modules[\\/]@auth0[\\/]/,
                name: 'auth0',
                priority: 20,
                reuseExistingChunk: true,
              },
              // React and React-DOM in separate chunk
              react: {
                test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
                name: 'react',
                priority: 20,
                reuseExistingChunk: true,
              },
              // Common code shared between chunks
              common: {
                minChunks: 2,
                priority: 5,
                reuseExistingChunk: true,
                enforce: true,
              },
            },
          },
          // Minimize runtime chunk
          runtimeChunk: 'single',
        };

        // Add bundle analyzer in production (optional, can be enabled with env var)
        if (process.env.ANALYZE_BUNDLE === 'true') {
          const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
          webpackConfig.plugins.push(
            new BundleAnalyzerPlugin({
              analyzerMode: 'static',
              openAnalyzer: false,
              reportFilename: 'bundle-report.html',
            })
          );
        }
      }

      return webpackConfig;
    },
  },
  // Babel configuration for better tree shaking
  babel: {
    plugins: [
      // Remove prop-types in production
      ...(process.env.NODE_ENV === 'production'
        ? [['transform-react-remove-prop-types', { removeImport: true }]]
        : []),
    ],
  },
};
