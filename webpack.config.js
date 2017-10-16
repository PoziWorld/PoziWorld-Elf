const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const webpackTargetElectronRenderer = require( 'webpack-target-electron-renderer' );

/**
 * @todo Switch to Webpack 2
 */

module.exports = {
  entry: {
    'elf': './src/native-messaging/elf.js',
    'main': './src/main/main.js',
    'renderer-intro': './src/renderers/intro/intro.js',
    'renderer-index-api-ai': './src/renderers/index-api-ai/index-api-ai.js',
    'renderer-index-wit-ai': './src/renderers/index-wit-ai/index-wit-ai.js',
    'renderer-activation': './src/renderers/activation/activation.js',
    'renderer-check-process-running': './src/renderers/helper-native-messaging/check-process-running.js',
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[id].bundle.js',
    path: __dirname + '/bundle',
  },
  module: {
    preLoaders: [
      {
        test: /\/.js$/,
        exclude: /node_modules/,
        loader: 'jshint-loader',
      },
    ],
    loaders: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract( 'style-loader', 'css-loader!postcss-loader' ),
      },
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          cacheDirectory: true,
          plugins: [
            'transform-class-properties',
            'transform-es2015-arrow-functions',
          ],
          presets: [
            'react',
            'es2015',
          ],
        },
      },
      {
        test: /\.json/,
        loader: 'json-loader',
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        exclude: /node_modules/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin( '../bundle/[name].bundle.css' ),
  ],
  postcss: [
    require( 'precss' ),
  ],
  resolve: {
    extensions: [
      '',
      '.css',
      '.js',
      '.json',
    ],
  },
  watch: true,
};

module.exports.target = webpackTargetElectronRenderer( module.exports );
