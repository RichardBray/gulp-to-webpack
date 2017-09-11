// Don't think I use gulp-util for anything but oh well, you never know.

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-ruby-sass'),
  minifyCSS = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  webserver = require('gulp-webserver'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  minifyHTML = require('gulp-minify-html'),
  imagemin = require('gulp-imagemin'),
  pngcrush = require('imagemin-pngcrush'),

// 1. Webserver
gulp.task('webserver', function() {
  gulp.src('src/').pipe(
    webserver({
      livereload: true,
      port: '8080'
    })
  );
});

// 2. SASS Minification and conversion to CSS
gulp.task('styles', function() {
  gulp
    .src('src/app/assets/styles/*.scss')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/assets/styles'));
});

// 3. JS Minificaiton and concatination
gulp.task('scripts', function() {
  gulp
    .src(['src/app/assets/*.js'])
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/scripts'));
});

// 4. HTML Minification
gulp.task('html', function() {
  var opts = { comments: true, spare: true };
  return gulp.src('src/app/**/*.html').pipe(minifyHTML(opts)).pipe(gulp.dest('dist/'));
});

// 5. Minify PNG, JPEG, GIF and SVG images
gulp.task('images', function() {
  return gulp
    .src('src/app/assets/img/**/*')
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngcrush()]
      })
    )
    .pipe(gulp.dest('dist/assets/img'));
});

// Watching files for changes
gulp.task('watch', function() {
  gulp.watch('src/app/assets/styles/*.scss', ['styles']);
  gulp.watch('src/app/scripts/*.js', ['scripts']);
  gulp.watch('src/app/assets/img/**/*', ['images']);
  gulp.watch('src/app/**/*.html', ['html']);
});

gulp.task('default', [
  'html',
  'styles',
  'scripts',
  'images',
  'watch',
  'webserver'
]);
