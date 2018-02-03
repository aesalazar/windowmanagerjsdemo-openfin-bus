const path = require('path');
const webpack = require('webpack');

//Allow storage of css in a separate file
const extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: {
        index: [
            './src-javascript/index.js',
            'webpack-hot-middleware/client?reload=true'
        ]
    },
    devtool: 'source-map',
    output: {
        publicPath: '/bundle',
        filename: 'javascript.js',
        path: path.resolve(__dirname, 'public/bundle')
    },
    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new extractTextPlugin("styles.css"),
    ],
    module: {
        rules: [           
            {
                test: /\.css$/,
                loader: extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
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