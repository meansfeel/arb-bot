const webpack = require('webpack');
const path = require('path');

module.exports = {
  // 这里可以添加你的 CRACO 配置
  webpack: {
    configure: (webpackConfig) => {
      // 添加 fallback
      webpackConfig.resolve.fallback = {
        ...webpackConfig.resolve.fallback,
        "stream": require.resolve("stream-browserify"),
        "http": require.resolve("stream-http"),
        "https": require.resolve("https-browserify"),
        "os": require.resolve("os-browserify/browser"),
        "crypto": require.resolve("crypto-browserify"),
        "buffer": require.resolve("buffer"),
        "process": require.resolve("process/browser"),
      };

      // 使用 ProvidePlugin
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      ];

      // 設置 performance hints
      webpackConfig.performance = {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
      };

      return webpackConfig;
    }
  },
  babel: {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react'
    ],
    plugins: [
      '@babel/plugin-proposal-private-property-in-object'
    ]
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1'
      }
    }
  }
};
