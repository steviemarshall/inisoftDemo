// package vars
//const pkg = require('./package.json');

// Require Packages
// const gulp = require('gulp');
// const gulpLoadPlugins = require('gulp-load-plugins');
// const plugins = gulpLoadPlugins();


// Require Gulp
const gulp = require('gulp');

// Require Packages
const autoprefixer = require('gulp-autoprefixer'),
      //clean = require('gulp-clean'),
      browserSync = require('browser-sync').create(),
      concat = require('gulp-concat'),
      cssnano = require('gulp-cssnano'),
      del = require('del'),
      imagemin = require('gulp-imagemin'),
      lec = require('gulp-line-ending-corrector'),
      log = require('fancy-log'),
      sass = require('gulp-sass'),
      size = require('gulp-size'),
      sourcemaps = require('gulp-sourcemaps'),
      uglify = require('gulp-uglify');

// Setup paths for dependencies
const paths = {
      bower: './bower_components',
      node: './node_modules',
      src: './src'
}

// Test function
function message(cb) {
  console.log('Awooga');
  cb();
}


// PRODUCTION -------------------------------------------------------->

// Empty Repository
// function cleanRepo(cb) {
//    return gulp.src([
//     './web/assets/dist/**'
//     ])
//     .pipe(clean({
//       read: false,
//       allowEmpty: true,
//       force: "true" 
//     }));
//     cb();
// }

function clean() {
  return del(["./web/assets/"]);
}

// function cleanRepo(cb) {
//    return clean(["./web/assets/"]);
//    cb();
// }

// Tasks: Set up SASS and pipe to folders
function styles() {
 log("-> Compiling SCSS");
  return gulp.src([
    paths.src + '/styles/app.scss',
    paths.src + '/styles/frontend.scss'
    ])
    .pipe(sourcemaps.init())
    .pipe(sass({
      includePaths: [
        paths.bower + '/foundation-sites/scss',
        paths.bower + '/motion-ui/src'
      ],
      errorLogToConsole: true,
      outputStyle: 'compressed'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browserlist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(cssnano({
      discardComments: {
          removeAll: true
      },
      discardDuplicates: true,
      discardEmpty: true,
      minifyFontValues: true,
      minifySelectors: true
    }))
    .pipe(concat('main.min.css'))
    .pipe(size({
      gzip: true,
      showFiles: true
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
    .pipe(gulp.dest('./web/assets/dist/css'))
    .pipe(browserSync.stream());
}


// Task: Set up JS and pipe to folders
function scripts() {
  log("-> Compiling Scripts");
  gulp.src([
    paths.bower + '/jquery/dist/jquery.js',
    paths.bower + '/foundation-sites/dist/js/foundation.js'
    ])
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest('./web/assets/dist/js'));

  return gulp.src([
    paths.src + '/js/script.js',
    paths.src + '/js/scripts/ui.js',
    paths.src + '/js/scripts/alertExample.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('scripts.min.js'))
    .pipe(size({
      //gzip: true,
      showFiles: true 
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(lec({verbose:true, eolc: 'LF', encoding:'utf8'}))
    .pipe(gulp.dest('./web/assets/dist/js'))
    .pipe(browserSync.stream());
}

// Task: Move fonts
function fonts() {
  log("-> Moving Fonts");
  return gulp.src([
    paths.src + '/fonts/**/*'
    ])
    .pipe(gulp.dest('./web/assets/dist/fonts'))
    .pipe(browserSync.stream());
}

// Task: Move images
function images() {
  log("-> Moving Images");
  return gulp.src([
    paths.src + '/images/**/*.+(png|jpg|jpeg|gif|svg)'
    ])
    .pipe(imagemin([
      imagemin.gifsicle({
        interlaced: true
      }),
      imagemin.mozjpeg({
        quality: 75, progressive: true
      }),
      imagemin.optipng({
        optimizationLevel: 5
      }),
      imagemin.svgo({
        plugins: [
            {removeViewBox: true},
            {cleanupIDs: false}
        ]})
      ]))
    .pipe(gulp.dest('./web/assets/dist/images'))
    .pipe(browserSync.stream());
}

// Task: Watch files/folders
function watch() {
  browserSync.init({
    open: 'external',
    proxy: 'http://localhost.inisoftdemo',
    port: 8080, 
  });
  gulp.watch(paths.src + '/styles/**/*.scss', styles);
  gulp.watch(paths.src + '/js/**/*.js', scripts);
  gulp.watch(paths.src + '/fonts/**/*', fonts);
  gulp.watch(paths.src + '/images/**/*', images).on('change', browserSync.reload);
}


// DISTRIBUTION -------------------------------------------------------------->

// Empty /dist/ Repository
// function cleanDist(cb) {
//    return gulp.src('./web/assets/dist/**/*')
//     .pipe(clean());
//     cb();
// }

// Move CSS to /dist/ & minify
// function distStyles() {
//   log("-> Dist: Styles")
//   return gulp.src('./web/assets/build/css/*.css')
//     .pipe(concat('main.min.css'))
//     .pipe(cssnano({
//       discardComments: {
//           removeAll: true
//       },
//       discardDuplicates: true,
//       discardEmpty: true,
//       minifyFontValues: true,
//       minifySelectors: true
//     }))
//     .pipe(size({
//       showFiles: true 
//     }))
//     .pipe(gulp.dest('./web/assets/dist/css'))
// }

// function distScripts() {
//   log("-> Dist: Scripts")
//   return gulp.src([
//       './web/assets/build/js/main.js',
//       './web/assets/build/js/scripts.js'
//     ])
//     .pipe(concat('main.min.js'))
//     .pipe(uglify())
//     .pipe(gulp.dest('./web/assets/dist/js'));
// }

// function distImages() {
//   log("-> Dist: Images")
//   return gulp.src([
//     paths.src + './web/assets/build/images/**/*.+(png|jpg|jpeg|gif|svg)'
//     ])
//     .pipe(gulp.dest());
// }





// GULP COMMANDS------------------------------------------------------------>


// const start = gulp.series(clean, gulp.parallel(styles, scripts, fonts, images), watch);
const start = gulp.series(clean, styles, scripts, fonts, images, watch);
gulp.task('start', start);


// Helper Task
exports.message = message;

// Build Tasks
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.watch = watch;
exports.default = start;


// Distibution Tasks
// exports.cleanDist = cleanDist;
// exports.distStyles = distStyles;
// exports.distScripts = distScripts;


