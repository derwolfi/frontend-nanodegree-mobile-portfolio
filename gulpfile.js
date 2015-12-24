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
    inject = require('gulp-inject');

// minify css Files
gulp.task('styles', function() {
  return gulp.src('css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

// minify css Files in folder view.
gulp.task('styles-view', function() {
  return gulp.src('view/css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(gulp.dest('view/dist/css'));
});

//  Minify js Files with UglifyJS2
gulp.task('scripts', function() {
  return gulp.src('js/**/*.js')
    // .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

//  Minify js Files with UglifyJS2 in view Folder
gulp.task('scripts-view', function() {
  return gulp.src('view/js/**/*.js')
    // .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('view/dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('view/dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// optimize images
gulp.task('images', function() {
  return gulp.src('img/**/*')
    .pipe(cache(imagemin({
    	optimizationLevel: 5,
    	progressive: true,
    	interlaced: true,
    	svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// optimize images in view Folder
gulp.task('images-view', function() {
  return gulp.src('view/img/**/*')
    .pipe(cache(imagemin({
    	optimizationLevel: 5,
    	progressive: true,
    	interlaced: true,
    	svgoPlugins: [{removeViewBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('view/dist/img'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Inject to HTML files
gulp.task('inject', function () {
  gulp.src('./*.html')
  .pipe(inject(gulp.src('dist/js/main.min.js', {read: false})))
  .pipe(gulp.dest('dist'));
});

// Inject to HTML files in view Folder
gulp.task('inject-view', function () {
  gulp.src('./view/*.html')
  .pipe(inject(gulp.src('view/dist/js/*.js', {read: false}), {relative: true}))
  .pipe(gulp.dest('view/dist'));
});

// Clean
gulp.task('clean', function() {
    return del(['dist/css', 'dist/js', 'dist/img', 'dist/*.html']);
});

// Clean in view Folder
gulp.task('clean-view', function() {
    return del(['view/dist/css', 'view/dist/js', 'view/dist/img', 'view/dist/*.html']);
});

// run all Tasks
gulp.task('default', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images', 'inject');
});

// run all Tasks for view Folder
gulp.task('default-view', ['clean-view'], function() {
    gulp.start('styles-view', 'scripts-view', 'images-view', 'inject-view');
});