// require node build in package
const path = require("path");
// require html plugin to autocopy html file
const HtmlWebpackPlugin = require("html-webpack-plugin");

// webpack configuration
module.exports = {
  entry: ["babel-polyfill", "./src/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "js/bundle.js",
  },
  devServer: {
    contentBase: "./dist"
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      filename: "index.html"
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  node: {
    fs: 'empty'
  }
};

// as an output we specify whole dist dir
// it's important, we serve whole dist dir

// one entry point as a main js file
// path to output must be absolute

// dev server serves dir from content base

// we use html plugin to auto copy index html
// on change, template is where te file's coming from
// filename just what it's called in dist dir