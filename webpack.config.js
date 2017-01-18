const webpack = require("webpack");
const helpers = require("./helpers");
const path = require("path");

var TypedocWebpackPlugin = require("typedoc-webpack-plugin");
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

module.exports = {
  devtool: "source-map",
  debug: true,
  entry: {
    "polyfills": "./src/polyfills",
    "vendor": "./src/vendor",
    "app": "./src/app/app",
    "github": [
      "./src/app/veri",
      "./src/app/github/github",
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
    extensions: [".ts", ".js", ".json", ".css", ".html"],
    modules: [helpers.root("src"), "node_modules"],
  },
  module: {
    loaders: [
      {
        exclude: [/node_modules/, /\.(spec|e2e)\.ts$/],
        loaders: ["awesome-typescript-loader", "angular2-template-loader"],
        test: /\.ts$/,
      },
      {
        loader: "json-loader",
        test: /\.json$/,
      },
      {
        test: /\.(html|css)$/,
        loader: "raw-loader",
        exclude: [helpers.root("index.html")]
      },
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
    new CommonsChunkPlugin({ name: ["common", "vendor", "polyfills"], minChunks: Infinity }),
    new TypedocWebpackPlugin({mode: "file", ignoreCompilerErrors: true, out: "../docs"}, ["./src/app"]),
  ],
  target: "electron-renderer",
};
