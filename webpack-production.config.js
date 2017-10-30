const WebpackStripLoader = require( 'strip-loader' );
const devConfig = require( './webpack.config.js' );

const stripLoader = {
  test: /\.js$/,
  exclude: /node_modules/,
  /**
   * @todo Make sure it doesn't conflict with log.js
   */
  loader: WebpackStripLoader.loader( 'alert' ),
};

devConfig.module.loaders.push( stripLoader );

devConfig.watch = false;

module.exports = devConfig;
