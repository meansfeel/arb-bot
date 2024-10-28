const webpack = require('webpack');
const path = require('path');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          http: false,
          https: false,
          url: false,
          stream: false
        }
      }
    }
  }
}
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
        "process": require.resolve("process/browser.js"),  // 添加 .js 擴展名
        "zlib": require.resolve("browserify-zlib"),
        "path": require.resolve("path-browserify"),
        "fs": false,
        "net": false,
        "tls": false
      };

      // 使用 ProvidePlugin
      webpackConfig.plugins = [
        ...webpackConfig.plugins,
        new webpack.ProvidePlugin({
          process: 'process/browser.js',  // 添加 .js 擴展名
          Buffer: ['buffer', 'Buffer']
        }),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        })
      ];

      // 設置 resolve.extensions
      webpackConfig.resolve.extensions = ['.js', '.jsx', '.json', '.mjs'];

      // 設置 resolve.mainFields
      webpackConfig.resolve.mainFields = ['browser', 'module', 'main'];

      return webpackConfig;
    }
  },
  style: {
    postcss: {
      plugins: [require('autoprefixer')]
    }
  },
  babel: {
    presets: [
      ['@babel/preset-env', { loose: true }],
      ['@babel/preset-react', { runtime: 'automatic' }]
    ],
    plugins: [
      ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
      ['@babel/plugin-proposal-class-properties', { loose: true }],
      ['@babel/plugin-proposal-private-methods', { loose: true }]
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
