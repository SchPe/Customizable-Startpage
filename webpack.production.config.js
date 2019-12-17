
const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ShakePlugin = require('webpack-common-shake').Plugin;
const WebpackBar = require('webpackbar');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const {InjectManifest} = require('workbox-webpack-plugin');



module.exports = {
    entry: './src/js/app.js',
    externals: {
		    jquery: 'jQuery'
	  },
    output: {
    filename: 'main.[hash].js',
    path: path.resolve(__dirname, 'dist', 'dist')
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist', 'dist'),
      compress: true,
      port: 5050
    },

    optimization: {
        minimizer: [new TerserJSPlugin({
          terserOptions: {
            compress: {
              drop_console: true,
            },
          },
        }), new OptimizeCSSAssetsPlugin({})],
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
            test: /(?<!bootstrap\-select\.min|icomoon|theme_1565893338864)\.css$/,
            use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
            ]
        },
        {
            test: /(:?bootstrap\-select\.min|icomoon|theme_1565893338864)\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        {
            test: /\.html$|\.ejs$|\.marko$/,
            use: [
                {
                    loader: "html-loader",
                    options: { minimize: true }
                }
            ]
        },
        
        {
          test: /\.(png|jpg|gif|ico|woff)$/i,
          use: [{
              loader: 'url-loader',
              options: {
                  limit: 8192, // in bytes
                  publicPath: './',
                  name: '[name].[contenthash].[ext]'
              }
          }]
        },
      ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebPackPlugin({
            template: "src/index.marko",
            filename: "index.marko",
            favicon: path.resolve(__dirname + '/src/images/favicon.ico'),
            minify: {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true,
              removeAttributeQuotes: false
            }
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[chunkhash].css"
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
        new ShakePlugin(),
        new WebpackBar(),
    ]
  }