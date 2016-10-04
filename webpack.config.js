var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  devtool: 'source-map',
  debug: true,
  entry: {
    'app': [
      './app/src/tarih',
      './app/src/etiket',
      './app/src/hedef',
      './app/src/olay',
      './app/src/yorum',
      './app/src/is',
      './app/src/katki',
      './app/src/proje',
      './app/src/kullanici',
      './app/src/github',
      './app/src/veri'
    ]
  },
  output: {
    path: __dirname + '/build/',
    publicPath: 'build/',
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js', '.json', '.css', '.html']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'ts',
        exclude: [/node_modules/]
      },
      {
        test: /\.json$/,
        loader: 'json',
        include: [/node_modules/]
      }
    ]
  },
  plugins: [
    new CommonsChunkPlugin({ name: 'common', filename: 'common.js' })
  ],
  target: 'electron-renderer'
};