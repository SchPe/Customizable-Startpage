
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


module.exports = {
    entry: './src/js/appMobile.js',
    externals: {
      jquery: 'jQuery',
      
	  },
    output: {
    filename: 'mainMobile.[hash].js',
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
            test: /\.css$/,
            use: [MiniCssExtractPlugin.loader, "css-loader"]
        },
        
        {
          test: /\.(png|jpg|gif|ico|woff)$/i,
          use: [{
              loader: 'url-loader',
              options: {
                  limit: 8192, // in bytes
                  publicPath: './',
                  name: '[name].[hash].[ext]'
              }
          }]
        },
      ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].mobile.[hash].css",
            chunkFilename: "[hash].mobile.css"
        }),
        new ShakePlugin(),
        new WebpackBar(),
    ]
  }