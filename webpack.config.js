const path = require('path')
module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: "boundle.js",
    path: path.resolve(__dirname, 'public')
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './public'
  }
}