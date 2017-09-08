const WebpackStripLoader = require( 'strip-loader' );
const devConfig = require( './webpack.config.js' );

// Only exposed entries (the ones that are shown as actual files)
devConfig.entry = {
  'elf': devConfig.entry.elf,
};

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
