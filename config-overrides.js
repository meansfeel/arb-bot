const webpack = require('webpack');

// config-overrides.js
module.exports = function override(config, env) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "url": require.resolve("url/"),
    "stream": require.resolve("stream-browserify")
  };
  return config;
}

