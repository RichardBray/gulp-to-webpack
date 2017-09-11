const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

let htmlOptions = {
  template: 'src/index.html',
  minify: {
    collapseWhitespace: true,
    removeAttributeQuotes: true
  }
};

module.exports = {
  entry: './src/app/app.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    /**
     * rules needs to be Array []
     */
    rules: [
    //   {
    //     test: /\.css$/,
      /**
         * Reads from right to left
         * css-loader - interprets @import and url() like import/require()
         * style-loader - CSS to DOM with <style>
         */
      // use: [
      //   'style-loader',
      //   {
      //     loader: 'css-loader',
      //     options: {
      //       minimize: true
      //     }
      //   }
      // ]
      /**
         * Load minimised vanilla CSS file to html
         * css-loader
         */
      // use: ExtractTextPlugin.extract({
      //   use: ['css-loader']
      // })
      // },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            },
            'sass-loader'
          ]
        })
      },
      {
        test: /\.(jpeg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }, 'image-webpack-loader'
        ]
      }
    ]
  },
  /**
   * plugins needs to be Array []
   */
  plugins: [
    new UglifyJSPlugin(),
    new ExtractTextPlugin('vanilla.css'),
    new HtmlWebpackPlugin(htmlOptions),
    new CleanWebpackPlugin(['dist']),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  /**
   * webpack-dev-server
   */
  devServer: {
    contentBase: './src'
  }
};
