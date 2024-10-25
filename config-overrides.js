const webpack = require('webpack');

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.js$/,
    use: ["source-map-loader"],
    enforce: "pre"
  });
  return config;
}
