const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');


module.exports = {
    entry: './src/js/app.js',
    externals: {
        jquery: 'jQuery',
	},
    output: {
    filename: '[name].main.js',
    path: path.resolve(__dirname, 'dev/dev')
    },
    devtool: 'inline-source-map',
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 5050
    },

    module: {
    rules: [
        {
            test: /\.js$/,
            loader: "babel-loader",
            exclude: /node_modules/,
            options: {
              configFile: path.resolve('babel.config.js')
            },
            include: [
                path.resolve('src/js/news'),
                path.resolve('src/js/github'),
                path.resolve('src/js/reddit'),
                path.resolve('src/js/anyWebsite'),
                path.resolve('src/js/main'),
                path.resolve('src/js/util'),
                path.resolve('src/js/app.js'),
                path.resolve('src/js/default')
            ]
        },
        {
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
            test: /\.html$|\.ejs$|\.marko$/,
            use: [
                {
                    loader: "html-loader",
                }
            ]
        },
        {
            test: /\.(png|jpg|gif|ico|woff)$/i,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 8192, 
                    publicPath: './',
                    name: '[name].[ext]'
                }
            }]
        },
    ]
    },

    plugins: [
        new HtmlWebPackPlugin({
            template: "src/index.marko",
            filename: "index.marko",
        }),

        new MiniCssExtractPlugin({
            filename: "[name].css",
            chunkFilename: "[id].css"
        }),
        new CopyPlugin([
            {
              from: 'src/*.txt',
              to: './',
              flatten: true
            },
            {
              from: 'src/*.marko',
              to: './',
              ignore: ['src/index.marko'],
              flatten: true
            },
            {                                                   
              from: 'src/*.json',
              to: './',
              flatten: true
            },
            {                                                   
              from: 'src/*.html',
              to: './',
              flatten: true
            },
            {                                                   
              from: 'src/images/icons/*.png',
              to: './images/icons',
              flatten: true
            },
            {                                                   
              from: 'src/images/*.png',
              to: './images',
              flatten: true
            }
        ]),
        new InjectManifest({
            swSrc: './src/js/sw.js'
        }),
        new FaviconsWebpackPlugin(path.resolve(__dirname + '/src/images/favicon.png')),
    ]
}