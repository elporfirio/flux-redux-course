const path = require('path');

module.exports = {
  mode: 'development',
  // entry: './src/index.js',
  entry: {
    'config': ['./src/index.js'],
    'tasks': ['./src/tasks.js']
  },
  output: {
    // filename: 'bundle.js',
    filename: "[name].js",
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  module: {
    rules: [
      {
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        test: /\.js?$/,
        query: {
          presets: ['es2015'],
          plugins: ['transform-object-rest-spread']
        }
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname), // New
    historyApiFallback: true
  }
};