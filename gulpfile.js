var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    pngquant = require('imagemin-pngquant'),
    del = require('del'),
    usemin = require('gulp-usemin'),
    gulpSequence = require('gulp-sequence'),
    foreach = require('gulp-foreach'),
    server = require('gulp-server-livereload'),
    htmlmin = require('gulp-htmlmin');


// optimize images
gulp.task('images', function() {
  return gulp.src('img/**/*')
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      svgoPlugins: [{removeviewsBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Clean
gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/img', 'dist/*.html']);
});

// Inject to HTML files

gulp.task('usemin', ['clean'], function() {
  return gulp.src('./*.html')
    .pipe(foreach(function (stream, file) {
      return stream.pipe(usemin({
        css: [ minifyCss ],
        inlinecss: [ minifyCss, 'concat' ],
        js: [ uglify ],
        jsAttributes: {
          async: true
        }
      }));
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify-html', function() {
  return gulp.src('dist/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

// optimize images in views Folder
gulp.task('images-views', function() {
  return gulp.src('views/images/**/*')
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      cache: false,
      interlaced: true,
      svgoPlugins: [{removeviewsBox: false}],
        use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/views/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Inject to HTML files in views Folder
gulp.task('usemin-views', ['clean-views'], function() {
  return gulp.src('./views/*.html')
    .pipe(foreach(function (stream, file) {
      return stream.pipe(usemin({
        css: [ minifyCss ],
        js: [ uglify ],
        jsAttributes: {
          async: true
        }
      }));
    }))
    .pipe(gulp.dest('dist/views/'));
});

gulp.task('minify-views-html', function() {
  return gulp.src('dist/views/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist/views'));
});


// Clean in views Folder
gulp.task('clean-views', function() {
    return del(['dist/views/css', 'dist/views/js', 'dist/views/images', 'dist/views/*.html']);
});

// Build all
gulp.task('build', function(done) {
  gulpSequence('usemin', 'usemin-views', ['images', 'images-views'], ['minify-html', 'minify-views-html'])(done);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      defaultFile: 'index.html',
      open: true
    }));
});