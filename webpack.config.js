const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  // devtool: "source-map", //开发用
  entry: __dirname + "/src/index.js",
  output: {
    path: __dirname + "/public",
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/,
        exclude: path.resolve(__dirname, "node_modules"),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 当前的css所在的文件相对于打包后的根路径dist的相对路径
              publicPath: "../",
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "main.css",
    }),
    new HtmlWebpackPlugin({
      title: "Bookmark",
      filename: "index.html",
      template: "src/index.html",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: __dirname + "/src/assets",
          to: __dirname + "/public/assets",
        },
      ],
    }),
  ],
};
