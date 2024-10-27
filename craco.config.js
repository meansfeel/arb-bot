const webpack = require('webpack');
const path = require('path');

module.exports = {
  // 这里可以添加你的 CRACO 配置
  webpack: {
    configure: {
      resolve: {
        fallback: {
          process: require.resolve('process/browser.js'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          stream: require.resolve('stream-browserify'),
        },
      },
      plugins: [
        new webpack.ProvidePlugin({
          process: 'process/browser.js',
        }),
      ],
    },
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
