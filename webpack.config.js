const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        home: ['babel-polyfill', './src/js/index.js'],
        log: './src/js/log.js',
        history: './src/js/history.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'), 
        filename: 'js/[name].bundle.js'
    },
    devServer: {
        contentBase: './dist'

    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            chunks: ["home"]
        }),
        new HtmlWebpackPlugin({
            filename: 'workout.html',
            template: './src/workout.html',
            chunks: ["log"]
        }),
        new HtmlWebpackPlugin({
            filename: 'history.html',
            template: './src/history.html',
            chunks: ["history"]
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use:{
                    loader: 'babel-loader'
                }
            }
        ]
    }
};