const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

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
      {
        test: /\.css$/,
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
        use: ExtractTextPlugin.extract({
          use: ['css-loader']
        })
      }
    ]
  },
  /**
   * plugins needs to be Array []
   */
  plugins: [new ExtractTextPlugin('styles.css')],
  /**
   * webpack-dev-server
   */
  devServer: {
    contentBase: './src',
    port: 3000
  }
};
