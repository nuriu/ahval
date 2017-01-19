var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var TypedocWebpackPlugin = require("typedoc-webpack-plugin");
var helpers = require('./helpers');

module.exports = {
  entry: {
    'polyfills': './src/polyfills',
    'vendor': './src/vendor',
    'app': './src/main',
    'github': [
      './src/app/github/github'
    ]
  },

  resolve: {
    extensions: ['', '.ts', '.js']
  },

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader']
      },
      {
        test: /\.html$/,
        loader: 'html'
      },
      {
        test: /\.css$/,
        exclude: helpers.root('src', 'app'),
        loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['common', 'app', 'vendor', 'polyfills']
    }),
    new TypedocWebpackPlugin({
      mode: "file", ignoreCompilerErrors: true, out: "../docs"}, ["./src/app"]
    ),
  ],
  target: 'electron-renderer'
};
