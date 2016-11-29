var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  devtool: 'source-map',
  debug: true,
  entry: {
    'app': [
      './app/src/veri'
    ],
    'trello': [
      './app/src/trello/trello'
    ],
    'github': [
      './app/src/github/github',
      './app/src/github/tarih',
      './app/src/github/etiket',
      './app/src/github/hedef',
      './app/src/github/olay',
      './app/src/github/yorum',
      './app/src/github/is',
      './app/src/github/katki',
      './app/src/github/proje',
      './app/src/github/kullanici',
    ],
    'akis.github': [
      './app/src/github/akis',
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