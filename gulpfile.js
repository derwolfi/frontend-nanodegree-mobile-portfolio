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
    livereload = require('gulp-livereload'),
    server = require('gulp-server-livereload'),
    htmlmin = require('gulp-htmlmin');

// minify css Files
// gulp.task('styles', function() {
//   return gulp.src('css/*.css')
//     .pipe(minifyCss())
//     .pipe(gulp.dest('dist/css'));
// });

//  Minify js Files with UglifyJS2
// gulp.task('scripts', function() {
//   return gulp.src('js/**/*.js')
//     // .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('default'))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('dist/js'))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/js'))
//     .pipe(notify({ message: 'Scripts task complete' }));
// });

// optimize images
gulp.task('images', function() {
  return gulp.src('img/**/*')
    .pipe(cache(imagemin({
    	optimizationLevel: 5,
    	progressive: true,
    	interlaced: true,
    	svgoPlugins: [{removeviewsBox: false}],
        use: [pngquant()]
    })))
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
    .pipe(usemin({
      css: [ minifyCss ],
      js: [ uglify ],
      jsAttributes: {
      	async: true
      }
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('minify', function() {
  return gulp.src('dist/*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('dist'));
});

// minify css Files in folder views.
// gulp.task('styles-views', function() {
//   return gulp.src('views/css/*.css')
//     .pipe(minifyCss())
//     .pipe(gulp.dest('dist/views/css'));
// });

//  Minify js Files with UglifyJS2 in views Folder
// gulp.task('scripts-views', function() {
//   return gulp.src('views/js/**/*.js')
//     // .pipe(jshint('.jshintrc'))
//     .pipe(jshint.reporter('default'))
//     .pipe(concat('main.js'))
//     .pipe(gulp.dest('dist/views/js'))
//     .pipe(rename({suffix: '.min'}))
//     .pipe(uglify())
//     .pipe(gulp.dest('dist/views/js'))
//     .pipe(notify({ message: 'Scripts task complete' }));
// });

// optimize images in views Folder
gulp.task('images-views', function() {
  return gulp.src('views/images/**/*')
    .pipe(cache(imagemin({
    	optimizationLevel: 5,
    	progressive: true,
    	interlaced: true,
    	svgoPlugins: [{removeviewsBox: false}],
        use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/views/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

// Inject to HTML files in views Folder
gulp.task('usemin-views', ['clean-views'], function() {
  return gulp.src('./views/*.html')
    .pipe(usemin({
      css: [ minifyCss ],
      js: [ uglify ]
    }))
    .pipe(gulp.dest('dist/views/'));
});

gulp.task('minify-views', function() {
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
	gulpSequence(['usemin', 'usemin-views'], ['images', 'images-views'], ['minify', 'minify-views'])(done);
});

gulp.task('webserver', function() {
  gulp.src('./')
    .pipe(server({
      livereload: true,
      defaultFile: 'index.html',
      open: true
    }));
});