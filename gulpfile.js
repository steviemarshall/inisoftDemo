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
      src: './src',
      build: './web/build/',
      dist: './web/dist/'
}

// Test function
function message(cb) {
  console.log('Awooga');
  cb();
}

// PRODUCTION -------------------------------------------------------->

function cleanBuild() {
  return del([paths.build]);
}

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
      outputStyle: 'expanded'
    }))
    .on('error', sass.logError)
    .pipe(autoprefixer({
      browserlist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('main.css'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest([
      paths.build + '/css'
    ]))
    .pipe(browserSync.stream());
}

// Task: Set up JS and pipe to folders
function scripts() {
  log("-> Compiling Scripts");
  gulp.src([
    paths.bower + '/jquery/dist/jquery.js',
    paths.bower + '/foundation-sites/dist/js/foundation.js'
    ])
    .pipe(concat('main.js'))
    .pipe(gulp.dest([
      paths.build + '/js'
      ]));

  return gulp.src([
    paths.src + '/js/script.js',
    paths.src + '/js/scripts/ui.js',
    paths.src + '/js/scripts/alertExample.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(concat('scripts.js'))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest([
      paths.build + '/js'
      ]))
    .pipe(browserSync.stream());
}

// Task: Move fonts
function fonts() {
  log("-> Moving Fonts");
  return gulp.src([
    paths.src + '/fonts/**/*'
    ])
    .pipe(gulp.dest([
      paths.build + '/fonts'
    ]))
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
    .pipe(gulp.dest([
      paths.build + '/images'
    ]))
    .pipe(browserSync.stream());
}

// Task: Watch files/folders
function watch() {
  browserSync.init({
    // open: 'external',
    proxy: 'http://localhost.inisoftdemo',
    // port: 8080, 
  });
  gulp.watch(paths.src + '/styles/**/*.scss', styles);
  gulp.watch(paths.src + '/js/**/*.js', scripts);
  gulp.watch(paths.src + '/fonts/**/*', fonts);
  gulp.watch(paths.src + '/images/**/*', images).on('change', browserSync.reload);
}


// DISTRIBUTION -------------------------------------------------------------->

// Empty /dist/ Repository
function cleanDist() {
  return del([paths.dist]);
}

// Move CSS to /dist/ & process
function stylesDist() {
  log("-> Dist: Styles")
  return gulp.src([
    paths.build + '/css/*.css'
    ])
    .pipe(sourcemaps.init())
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
    .pipe(lec({
      verbose: true,
      eolc: 'LF',
      encoding:'utf8'
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest([
      paths.dist + '/css'
    ]));
}

// Move JS to /Dist/ & process
function scriptsDist() {
  log("-> Dist: Scripts")
  return gulp.src([
      paths.build + '/js/main.js',
      paths.build + '/js/scripts.js'
    ])
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(size({
      gzip: true,
      showFiles: true 
    }))
    .pipe(lec({
      verbose:true,
      eolc: 'LF',
      encoding:'utf8'
    }))
    .pipe(sourcemaps.write('./maps'))
    .pipe(gulp.dest([
      paths.dist + '/js'
    ]));
}

// Task: Move fonts to /Dist/
function fontsDist() {
  log("-> Dist: Fonts");
  return gulp.src([
    paths.build + '/fonts/**/*'
    ])
    .pipe(gulp.dest([
      paths.dist + '/fonts'
    ]));
}

// Task Move image to /Dist/
function imagesDist() {
  log("-> Dist: Images")
  return gulp.src([
    paths.build + '/images/**/*.+(png|jpg|jpeg|gif|svg)'
    ])
    .pipe(gulp.dest([
      paths.dist + '/images'
    ]));
}





// GULP COMMANDS------------------------------------------------------------>

// const start = gulp.series(clean, gulp.parallel(styles, scripts, fonts, images), watch);
const start = gulp.series(cleanBuild, styles, scripts, fonts, images, watch);
gulp.task('start', start);


const readyDist = gulp.series(cleanDist, stylesDist, scriptsDist, fontsDist, imagesDist);
gulp.task('readyDist', readyDist)

// Helper Task
exports.message = message;

// Build Tasks
exports.cleanBuild = cleanBuild;
exports.styles = styles;
exports.scripts = scripts;
exports.fonts = fonts;
exports.images = images;
exports.watch = watch;
exports.default = start;


// Distibution Tasks
exports.cleanDist = cleanDist;
exports.stylesDist = stylesDist;
exports.scriptsDist = scriptsDist;
exports.fontsDist = fontsDist;
exports.imagesDist = imagesDist;
exports.readyDist = readyDist;
