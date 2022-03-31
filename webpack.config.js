const isProduction = process.argv[process.argv.indexOf('--mode') + 1] === 'production';
const path = require('path');


module.exports = {
  mode: 'production',
  entry: ['./src/index.js'],
  devtool: !isProduction?'source-map':null,
  devServer: {
    contentBase: '../',
    watchContentBase: true
  },
  output: {
    filename: 'llgameloader.js',
    path: __dirname,
    publicPath:'/'+__dirname.split('/').pop()+'/'
  }
}
