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
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        }),
      );

      // 添加 resolve.alias
      webpackConfig.resolve.alias = {
        ...webpackConfig.resolve.alias,
        'process/browser': path.resolve(__dirname, 'node_modules/process/browser.js'),
      };

      const scopePluginIndex = webpackConfig.resolve.plugins.findIndex(
        ({ constructor }) => constructor && constructor.name === 'ModuleScopePlugin'
      );
      webpackConfig.resolve.plugins.splice(scopePluginIndex, 1);

      return webpackConfig;
    }
  }
};
