import path from 'path';
import webpack from 'webpack';

const buildRoot = './html';
const buildAssets = './html/assets';
const srcRoot = './src';
const srcAssets = '/src/assets';

const pkg = require('./package.json');

const isDebug = global.DEBUG === false ? false : !process.argv.includes('--release');
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');
const useHMR = !!global.HMR;
const babelConfig = Object.assign({}, pkg.babel, {
  babelrc: false,
  cacheDirectory: useHMR,
  presets: pkg.babel.presets.map(x => x === 'latest' ? ['latest', { es2015: { modules: false } }] : x),
});

const config = {
  context: path.resolve(__dirname, './src'),

  entry: './assets/js/scripts.js',

  output: {
    path: path.resolve(__dirname, './.tmp/assets/js'),
    publicPath: isDebug ? `http://localhost:${process.env.PORT || 9000}/assets/js/` : '/assets/js/',
    filename: isDebug ? '[name].js?[hash]' : '[name].[hash].js',
    chunkFilename: isDebug ? '[id].js?[chunkhash]' : '[id].[chunkhash].js',
    sourcePrefix: '  ',
  },
  // resolve: {
  //   root: path.resolve(__dirname, srcRoot),
  //   modulesDirectories: ['node_modules'],
  //   extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.json'],
  //   // alias: {
  //   //   'jquery': `${__dirname}/node_modules/jquery/dist/jquery`,
  //   // },
  // },
  devtool: isDebug ? 'source-map' : false,
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': isDebug ? '"development"' : '"production"',
      __DEV__: isDebug,
    }),
    new webpack.LoaderOptionsPlugin({
      debug: isDebug,
      minimize: !isDebug,
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [
          path.resolve(__dirname, srcRoot),
        ],
        loader: 'babel-loader',
        options: babelConfig,
      },
      {
        test: /\.json$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'json-loader',
      },
    ],
  },
};

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: isVerbose,
    },
  }));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

// Hot Module Replacement (HMR) + React Hot Reload
if (isDebug && useHMR) {
  // babelConfig.plugins.unshift('react-hot-loader/babel');
  // config.entry.unshift('react-hot-loader/patch', 'webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoEmitOnErrorsPlugin());
}

module.exports = config;
