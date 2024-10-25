const webpack = require('webpack');
const path = require('path');

module.exports = {
  // ... 其他配置
  stats: {
    warningsFilter: [/Failed to parse source map/],
  },
};
