const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
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