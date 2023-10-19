const gulp = require('gulp'),
  sass = require('gulp-sass')(require('sass')),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  cssnano = require('cssnano'),
  sourcemaps = require('gulp-sourcemaps'),
  rigger = require('gulp-rigger'),
  // imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  babel = require('gulp-babel'),
  pump = require('pump');

const browserSync = require('browser-sync').create();

function scripts(cb) {
    return (
      pump([
          gulp.src([
              'src/js/*.js'
          ]),
          // rigger(),
          // concat('main.js'),
          // uglify(),
          sourcemaps.write(),
          // rename({suffix: '.min'}),
          // babel(),
          gulp.dest('dist/js'),
          browserSync.stream({match: '**/*.js'}),
      ], cb)
    );
}

function copyHtml() {
    return (
      gulp.src('src/*.html')
        .pipe(rigger())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream({match: '**/*.html'}))
    );
}

function copyLibs() {
  return (
    gulp.src('src/libs/**/*')
      .pipe(gulp.dest('dist/libs'))
  );
}

function imageCopy() {
    return (
      gulp.src('src/images/**/*')
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/images'))
    );
}

function picturesCopy() {
    return (
      gulp.src('src/pictures/*')
        // .pipe(imagemin())
        .pipe(gulp.dest('dist/pictures'))
    );
}

function style() {
    return (
      gulp
        .src([
            'src/scss/*.scss',
            'src/css/*.css',
        ])
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on('error', sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(rename({suffix: '.min'}))
        .pipe(
          postcss([
              autoprefixer(),
              cssnano(),
          ])
        )
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream({match: '**/*.css'}))
    );
}

function fonts() {
    return (
      gulp
        .src('src/fonts/*.{eot,svg,ttf,woff,woff2,otf}')
        .pipe(gulp.dest('dist/fonts'))
    );
}

function watch() {
    browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
    gulp.watch('src/*.html', copyHtml);
    gulp.watch('src/templates/*.html', copyHtml);
    gulp.watch('src/images/**/*', imageCopy);
    gulp.watch('src/libs/**/*', copyLibs);
    gulp.watch('src/pictures/*', picturesCopy);
    gulp.watch('src/js/*.js', scripts);
    gulp.watch('src/scss/**/*.scss', style);
}

// Build


const build = gulp.series(gulp.parallel(copyHtml, imageCopy, copyLibs, scripts, style, fonts, picturesCopy));


exports.watch = watch;
exports.style = style;
exports.copyHtml = copyHtml;
exports.imageCopy = imageCopy;
exports.copyLibs = copyLibs;
exports.picturesCopy = picturesCopy;
exports.fonts = fonts;
exports.scripts = scripts;

exports.default = build;
