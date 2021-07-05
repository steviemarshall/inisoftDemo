// package vars
//const pkg = require('./package.json');

// Require Packages
// const gulp = require('gulp');
// const gulpLoadPlugins = require('gulp-load-plugins');
// const plugins = gulpLoadPlugins();


// Require Gulp
const gulp = require('gulp');

// Require Packages
const sass = require('gulp-sass'),
      size = require('gulp-size'),
      concat = require('gulp-concat'),
      clean = require('gulp-clean'),
      log = require('fancy-log'),
      sourcemaps = require('gulp-sourcemaps'),
      autoprefixer = require('gulp-autoprefixer');

// Setup paths for dependencies
const paths = {
      bower: './bower_components',
      src: './src',
      node: './node_modules'
}

// Test function
function message(cb) {
  console.log('hello');
  cb();
}

// Empty Repository
function cleanRepo(cb) {
   return gulp.src('./web/assets/**/*')
    .pipe(clean());
    cb();
}

// PRODUCTION -------------------------------------------------------->

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
      outputStyle: 'explanded'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browserlist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(size())
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest('./web/assets/build/css'))
}


// Task: Set up JS and pipe to folders
function scripts() {
  log("-> Compiling Scripts");
  gulp.src([
    paths.bower + '/jquery/dist/jquery.js',
    paths.bower + '/foundation-sites/dist/js/foundation.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./web/assets/build/js'));

  return gulp.src([
    paths.src + '/js/script.js',
    paths.src + '/js/scripts/ui.js'
    ])
    .pipe(concat('scripts.js'))
    .pipe(size())
    .pipe(gulp.dest('./web/assets/build/js'));
}


// Task: Move fonts
function fonts() {
  log("-> Moving Fonts");
  return gulp.src([
    paths.src + '/fonts/**/*'
    ])
    .pipe(gulp.dest('./web/assets/build/fonts'))
}

// Task: Move images
function images() {
  log("-> Moving Images");
  return gulp.src([
    paths.src + '/images/**/*.+(png|jpg|jpeg|gif|svg)'
    ])
    .pipe(gulp.dest('./web/assets/build/images'))
}

// Task: Watch files/folders
function watch() {
  gulp.watch(paths.src + '/styles/**/*.scss', styles);
  gulp.watch(paths.src + '/js/**/*.js', scripts);
  gulp.watch(paths.src + '/fonts/**/*', fonts);
  gulp.watch(paths.src + '/images/**/*', images);
}


// DISTRIBUTION -------------------------------------------------------------->


// function styles() {
 // log("-> Compiling SCSS");
 //  return gulp.src([
 //    paths.src + '/styles/app.scss',
 //    paths.src + '/styles/frontend.scss'
 //    ])
 //    .pipe(sourcemaps.init())
 //    .pipe(sass({
 //      includePaths: [
 //        paths.bower + '/foundation-sites/scss',
 //        paths.bower + '/motion-ui/src'

 //      ],
 //      errorLogToConsole: true,
 //      outputStyle: 'explanded'
 //    }))
 //    .on('error', sass.logError)
 //    .pipe(autoprefixer({
 //      browserlist: ['last 2 versions'],
 //      cascade: false
 //    }))
 //    .pipe(concat('main.css'))
 //    .pipe(size())
 //    .pipe(sourcemaps.write('./maps'))
 //    .pipe(gulp.dest('./web/assets/build/css'))
// }





// GULP COMMANDS------------------------------------------------------------>

// First setup command
// function start() {
//   gulp.series(clean, gulp.parallel(styles, scripts, fonts, images));
// }


const start = gulp.series(cleanRepo, gulp.parallel(styles, scripts, fonts, images), watch);
gulp.task('start', start);


exports.message = message;
exports.cleanRepo = cleanRepo;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.watch = watch;
exports.default = start;