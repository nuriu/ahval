var path = require("path");
var webpack = require("webpack");
var TypedocWebpackPlugin = require("typedoc-webpack-plugin");
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  devtool: "source-map",
  debug: true,
  entry: {
    "app": [
      "./app/src/veri",
    ],
    "github": [
      "./app/src/github/github",
    ],
  },
  output: {
    chunkFilename: "[id].chunk.js",
    filename: "[name].js",
    path: __dirname + "/build/",
    publicPath: "build/",
    sourceMapFilename: "[name].js.map",
  },
  resolve: {
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
  },
  module: {
    loaders: [
      {
        exclude: [/node_modules/],
        loader: "awesome-typescript-loader",
        test: /\.tsx?$/,
      },
      {
        include: [/node_modules/],
        loader: "json-loader",
        test: /\.json$/,
      }
    ],
    preLoaders: [
      {
        loader: "source-map-loader",
        test: /\.js$/,
      }
    ]
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM",
  },
  plugins: [
    new CommonsChunkPlugin({ name: "common", filename: "common.js" }),
    new TypedocWebpackPlugin({mode: "file", ignoreCompilerErrors: true, out: "../docs"}, ["./app/src"]),
  ],
  target: "electron-renderer",
};
