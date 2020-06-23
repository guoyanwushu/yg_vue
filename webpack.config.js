const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();
module.exports = smp.wrap({
  mode: 'production',
  entry: './index.js',
  devtool: 'inline-source-map',
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [{
      test: /\.css/,
      use: ['css-loader', {
        loader: "postcss-loader",
        options: {
          plugins: [require('autoprefixer')]
        }
      }]
    }]
  },
  devServer: {
    port: 8082,
    contentBase: path.resolve(__dirname, 'public'),
    hot: true,
    noInfo: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html')
    }),
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})