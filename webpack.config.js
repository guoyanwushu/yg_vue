const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, 'public')
  },
  module: {
    rules: [{
      test: /\.css/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', {
        loader: "postcss-loader",
        options: {
          plugins: [require('autoprefixer')]
        }
      }]
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    noInfo: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html')
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
}