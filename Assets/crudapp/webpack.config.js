var path = require("path");
var phifty = require("phifty");
var webpack = require("webpack");
var excludePaths = phifty.webpackExcludePaths();
var aliases = phifty.assetAliases();

module.exports = {

  entry: __dirname + '/entry',

  output: { path: __dirname, filename: './bundle.js' },

  module: {
    loaders: [
      {
        "test": /\.tsx?$/,
        "loader": "ts-loader",
        "exclude": [/node_modules/,excludePaths]
      },
      {
        "test": /\.jsx?$/,
        "loader": "babel-loader",
        "query": {
            "presets": ["react", "es2015"],
            "plugins": ["transform-class-properties"]
        },
        "exclude": [/node_modules/,excludePaths]
      }
    ]
  },

  externals: {
    // don't bundle the 'react' npm package with our bundle.js
    // but get it from a global 'React' variable
    'react': 'React'
  },

  resolve: {
    extensions: ['', '.ts', '.tsx', '.js', '.jsx'],
    fallback: [ path.join(__dirname, "node_modules"), phifty.moduleDirectory],
    alias: aliases
  },

  resolveLoader: {
    fallback: [ path.join(__dirname, "node_modules"), phifty.moduleDirectory]
  }
};

