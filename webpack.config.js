const webpack = require('webpack');
const path = require('path');

// webpack.config.js
module.exports = {
  resolve: {
    fallback: {
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "url": require.resolve("url/"),
      "stream": require.resolve("stream-browserify")
    }
  }
}

