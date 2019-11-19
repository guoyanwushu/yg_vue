const path = require('path')
module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    filename: "boundle.js",
    path: path.resolve(__dirname, 'public')
  },
  devServer: {
    contentBase: './public'
  }
}