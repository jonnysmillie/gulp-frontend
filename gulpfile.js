var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    webserver = require('gulp-webserver'),
    livereload = require('gulp-livereload'),
    del = require('del');
    sourcemaps = require('gulp-sourcemaps');



// gulp scripts task: concatenate, minify, and copy all js to all.min.js file. Copy to the dist/scripts folder.



gulp.task('scripts', function() {
    return sass('js/*.js', { style: 'expanded' })
        // initialise sourcemaps
        .pipe(sourcemaps.init())
        .pipe(jshint.reporter('default'))
        .pipe(concat('global.js'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(rename("all.min.js"))
        .pipe(uglify())
        // write sourcemaps
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/scripts'))
        .pipe(notify({ message: 'Scripts task complete' }));
});


// gulp styles task: compile SCSS files into CSS. concatenate and minify into an all.min.css file. Copy to the dist/styles folder.


gulp.task('styles', function() {
    return sass('sass/*.scss', { style: 'expanded' })
        // initialise sourcemaps
        .pipe(sourcemaps.init())
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(rename("all.min.css"))
        .pipe(cssnano())
        // write sourcemaps
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('dist/styles'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// gulp images task: optimise images

gulp.task('images', function() {
  return gulp.src('images/*')
    .pipe(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/content'))
    .pipe(notify({ message: 'Images task complete' }));
});

// gulp clean task: delete all files and folders in 'dist' folder

gulp.task('clean', function() {
    return del(['dist/styles', 'dist/scripts', 'dist/content']);
});


// gulp start task: run styles, scripts, images

gulp.task('build', ['clean'], function() {
    gulp.start('styles', 'scripts', 'images');
});

// change default gulp task to start build

gulp.task('default', ['clean'], function() {
    gulp.start('build');
});

// gulp serve task: local webserver

gulp.task('serve', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      open: true,
      fallback: 'index.html'
    }));

});

gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('sass/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('js/*.js', ['scripts']);

  // Watch image files
  gulp.watch('images/*', ['images']);

  // Create LiveReload server
  livereload.listen();

  // Watch any files in dist/, reload on change
  gulp.watch(['/']).on('change', livereload.changed);

});




