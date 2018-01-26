const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        index: [
            './src-javascript/index.js',
            'webpack-hot-middleware/client?reload=true' //TODO: figure out why HMR does not work
        ]
    },
    devtool: 'source-map',
    output: {
        filename: 'javascript.js',
        path: path.resolve(__dirname, 'public/bundle')
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin()
    ],
    devServer: {
        port: 5000,
        contentBase: 'public',
        publicPath: '/bundle',
        historyApiFallback: {
            index: 'javascript.html'
        },
        hot: true,
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
                        presets: ['babel-preset-env', 'es2015']
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