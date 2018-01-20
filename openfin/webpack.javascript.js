const path = require('path');

module.exports = {
    entry: './src-javascript/index.js',
    output: {
        filename: 'javascript.js',
        path: path.resolve(__dirname, 'public/bundle')
    },
    module: {
        rules: [
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