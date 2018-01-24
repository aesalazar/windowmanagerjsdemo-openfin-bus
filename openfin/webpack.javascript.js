const path = require('path');

module.exports = {
    entry: './src-javascript/index.js',
    devtool: 'source-map',
    output: {
        filename: 'javascript.js',
        path: path.resolve(__dirname, 'public/bundle')
    },
    devServer: {
        port: 5000,
        contentBase: 'public',
        publicPath: '/bundle/',
        historyApiFallback: {
            index: 'javascript.html'
        },
        hot: true,
        lazy: false,
        overlay: {
            warnings: true,
            errors: true
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['babel-preset-env']
                    }
                }
            },
            {
                test: /\.js$/,
                enforce: "pre", // preload the jshint loader
                exclude: /node_modules/,
                use: [
                    {
                        loader: "jshint-loader"
                    }
                ]
            },
            {
                test: /test\.js$/,
                use: 'mocha-loader',
                exclude: /node_modules/,
            }
        ]
    }
};