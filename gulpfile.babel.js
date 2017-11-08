import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import webpackConfig from './webpack.config';

const bs = browserSync.create();

const $ = gulpLoadPlugins();
const reload = browserSync.reload;
const pkg = require('./package.json');
const gutil = require('gutil');
const chalk = require('chalk');
const webpack = require('webpack');
const nunjucksRender = require('gulp-nunjucks-render');
const lost = require('lost');
const center = require('postcss-center');
const cssmqpacker = require('css-mqpacker');
const cssnano = require('cssnano');
const precss = require('precss');
const size = require('postcss-size');
const conditionals = require('postcss-conditionals');
const cssnext = require('postcss-cssnext');
const assets = require('postcss-assets');
const rucksack = require('rucksack-css');
const functions = require('postcss-functions');

const compiler = webpack(webpackConfig);

const paths = {
  buildRoot: 'html',
  buildAssets: 'html/assets',
  srcRoot: 'src',
  srcAssets: 'src/assets',
  tmp: '.tmp',
};

const projectName = 'C is';

const banner = ['/**',
  ' * <%= pkg.name %> - <%= pkg.title %>',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.url %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n');


function onError(error) {
  gutil.log(
    chalk.cyan('Plumber') + chalk.red(' found unhandled error:\n'),
    error.toString(),
  );

  this.emit('end');
}

gulp.task('postcss', () => {
  const processors = [
    precss,
    functions({
      functions: {
        grid: ($width, $columns, $margin) => ($width / $columns) - ($margin * 2),
        'strip-units': $value => $value / (($value * 0) + 1),
      },
    }),
    center,
    size,
    conditionals,
    cssnext({
      autoprefixer: {
        browsers: ['last 2 version', 'ie 9', 'ios 6', 'android 4'],
      },
      core: false,
      features: { rem: false },
    }),
    lost(),
    rucksack({
      autoprefixer: false,
    }),
    cssmqpacker,
    cssnano({
      autoprefixer: false,
    }),
  ];

  return gulp.src(`${paths.srcRoot}/css/*.css`)
    .pipe($.sourcemaps.init())
    .pipe($.postcss(processors))
    .on('error', onError)
    .pipe($.postcss([assets({
      basePath: `${paths.srcRoot}/`,
      loadPaths: ['assets/images/'],
    })]))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(paths.tmp))
    .pipe($.header(banner, { pkg: pkg }))
    .pipe(gulp.dest(paths.buildRoot))
    .pipe(reload({ stream: true }));
});

gulp.task('html', ['postcss', 'nunjucks'], () => {
  const options = {
    searchPath: [paths.tmp, paths.srcRoot, '.'],
  };
  return gulp.src(`${paths.tmp}/**/*.html`)
    .pipe($.if('**/*.js', $.uglify()))
    .pipe($.useref(options))
    // .pipe($.if('*.html', $.minifyHtml({conditionals: true, loose: true})))
    .pipe(gulp.dest(paths.buildRoot));
});

gulp.task('replace', () => {
  const options = {
    searchPath: [`${paths.tmp}/**/*.js`, `${paths.srcRoot}/data/**/*`],
  };
  gulp.src([`${paths.tmp}/**/*.js`, `${paths.srcRoot}/**/*.json`])
    .pipe($.useref(options))
    .pipe($.if('**/*.js', $.uglify()))
    .pipe(gulp.dest(paths.buildRoot));
});

gulp.task('nunjucks', () => (
  gulp.src(`${paths.srcRoot}/template/pages/**/*.html`)
    .pipe($.plumber({
      errorHandler: onError,
    }))
    .pipe(nunjucksRender({
      data: {
        project_name: projectName,
        css_path: '',
        img_path: '/assets/images/',
      },
      path: [`${paths.srcRoot}/template/`],
    })).on('error', gutil.log)
    .pipe(gulp.dest(paths.tmp))
));

gulp.task('images', () => (
  gulp.src(`${paths.srcAssets}/images/**/*`)
    .pipe($.if($.if.isFile, $.cache($.imagemin({
      progressive: true,
      interlaced: true,
      svgoPlugins: [{ cleanupIDs: false }],
    }))
      .pipe($.plumber({
        errorHandler: onError,
      }))
      .on('error', (err) => {
        console.log(err);
      })))
    .pipe(gulp.dest(`${paths.buildAssets}/images`))
));

gulp.task('fonts', () => (
  gulp.src(`${paths.srcAssets}/fonts/**/*`)
    .pipe(gulp.dest(`${paths.tmp}/assets/fonts`))
    .pipe(gulp.dest(`${paths.buildAssets}/fonts`))
));

gulp.task('webpack', (callback) => {
  webpack(webpackConfig, (err, stats) => {
    if (err) throw new gutil.PluginError('webpack', err);
    gutil.log('[webpack]', stats.toString({
      // output options
    }));
    callback();
  });
  // return gulp.src(`${paths.srcAssets}/js/scripts.js`)
  //   .pipe($.plumber({
  //     errorHandler: onError,
  //   }))
  //   .pipe(webpack(webpackConfig)).on('error', gutil.log)
  //   .pipe(gulp.dest(`${paths.tmp}/assets/js`))
  //   // .pipe($.uglify())
  //   .pipe(gulp.dest(`${paths.buildAssets}/js/`));
});

gulp.task('extras', () => (
  gulp.src([
    paths.srcRoot + '/*.*',
    !paths.srcRoot + '/template/*',
  ], {
    dot: true,
  }).pipe(gulp.dest(paths.buildRoot))
));

gulp.task('clean', del.bind(null, ['.tmp', 'html']));

gulp.task('serve', ['nunjucks', 'postcss', 'fonts'], () => {
  // browserSync({
  //   // notify: false,
  //   // proxy: "192.168.10.10/",
  //   port: 9000,
  //   server: {
  //     baseDir: [paths.tmp, paths.srcRoot],
  //     routes: {
  //       '/node_modules': 'node_modules',
  //     },
  //   },
  // });

  // const webpackDevMiddleware = require('webpack-dev-middleware')(compiler, {
  //   publicPath: webpackConfig.output.publicPath,
  //   stats: webpackConfig.stats,
  // });

  browserSync({
    port: process.env.PORT || 9000,
    ui: { port: Number(process.env.PORT || 9000) + 1 },
    server: {
      baseDir: [paths.tmp, paths.srcRoot],
      // middleware: [
      //   webpackDevMiddleware,
      //   require('webpack-hot-middleware')(compiler),
      //   require('connect-history-api-fallback')(),
      // ],
      routes: {
        '/node_modules': 'node_modules',
      },
    },
  });

  gulp.watch([
    `${paths.tmp}/**/*.html`,
    `${paths.srcAssets}/js/**/*.js`,
    `${paths.srcAssets}/images/**/*`,
    `${paths.srcAssets}/fonts/**/`,
  ]).on('change', reload);

  gulp.watch(`${paths.srcRoot}/template/**/*.html`, ['nunjucks', reload]);
  gulp.watch(`${paths.srcAssets}/js/**/*.js`, ['webpack']);
  gulp.watch(`${paths.srcRoot}/css/**/*.css`, ['postcss']);
  gulp.watch(`${paths.srcAssets}/fonts/**/*`, ['fonts']);
});

gulp.task('serve:dist', ['replace'], () => {
  browserSync({
    notify: false,
    port: 9000,
    server: {
      baseDir: [paths.buildRoot],
    },
  });
});

gulp.task('serve:test', () => {
  browserSync({
    notify: false,
    port: 9000,
    ui: false,
    server: {
      baseDir: 'test',
      routes: {
        '/js': 'src/assets/js',
        '/node_modules': 'node_modules',
      },
    },
  });

  gulp.watch('test/spec/**/*.js').on('change', reload);
  gulp.watch('test/spec/**/*.js', ['lint:test']);
});

gulp.task('build', ['postcss', 'images', 'fonts', 'webpack', 'html', 'extras', 'replace'], () => {
  global.HMR = !process.argv.includes('--no-hmr');
  return gulp.src(`${paths.srcRoot}/**/*`).pipe($.size({ title: 'build', gzip: true }));
});

gulp.task('start', ['postcss', 'webpack']);

gulp.task('default', () => {
  gulp.start('start');
  gulp.start('serve');
});
