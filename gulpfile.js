// Don't think I use gulp-util for anything but oh well, you never know.

var gulp = require('gulp'),
  gutil = require('gulp-util'),
  sass = require('gulp-ruby-sass'),
  prefix = require('gulp-autoprefixer'),
  minifyCSS = require('gulp-minify-css'),
  concat = require('gulp-concat'),
  webserver = require('gulp-webserver'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  minifyHTML = require('gulp-minify-html'),
  imagemin = require('gulp-imagemin'),
  pngcrush = require('imagemin-pngcrush'),
  uncss = require('gulp-uncss');

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
    .pipe(prefix('last 1 version', '> 1%', 'ie 8', 'ie 7'))
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

// 6. Copying the fonts from 'app' to 'dest'
gulp.task('fonts', function() {
  return gulp
    .src(['src/app/assets/fonts/*'])
    .pipe(gulp.dest('dist/assets/fonts'));
});

// 7. Copying bower components if you have them from 'app' to 'dest' **optional**
gulp.task('components', function() {
  return gulp
    .src(['src/app/components/**/*'])
    .pipe(gulp.dest('dist/components'));
});

// 8. Copying all the other files from 'src' to 'dist'
gulp.task('copy', function() {
  return gulp
    .src(
      [
        'src/app/*',
        '!src/app/*.html', //needed for html minification
        '!src/app/components', //add 'components to default task if you want it copied over'
        '!src/app/Gemfile'
      ],
      {
        dot: true
      }
    )
    .pipe(gulp.dest('dist'));
});

// 9. Removing the unused classes in your css **optional**
gulp.task('uncss', function() {
  return gulp
    .src('dist/assets/styles/style.min.css')
    .pipe(
      uncss({
        html: ['src/index.html']
      })
    )
    .pipe(minifyCSS())
    .pipe(gulp.dest('dist/assets/styles/'));
});

// Watching files for changes
gulp.task('watch', function() {
  gulp.watch('src/app/assets/styles/*.scss', ['styles']);
  gulp.watch('src/app/scripts/*.js', ['scripts']);
  gulp.watch('src/app/assets/img/**/*', ['images']);
  gulp.watch('src/app/**/*.html', ['html']);
});

gulp.task('default', [
  'copy',
  'html',
  'styles',
  'fonts',
  'scripts',
  'images',
  'watch',
  'webserver'
]);
gulp.task('chkcss', ['uncss', 'webserver']); //checks if uncss worked
