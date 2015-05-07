var gulp   = require('gulp');
var mochify = require('mochify');
var eslint = require('gulp-eslint');
var argv = require('yargs').argv;

const args = {
  watch : !!argv.watch,
  coverage : !!argv.coverage,
  reporter : argv.reporter || 'spec',
  inspect: !!argv.inspect
};

const files = {
  src : './index.js',
  test: './test/index.js'
};


/**
 * Linting using eslint
 */
gulp.task('lint', ['lint-src', 'lint-tests']);

gulp.task('lint-tests', function () {
  return gulp.src([files.test])
    .pipe(eslint())
    .pipe(eslint.format())
  ;
});
gulp.task('lint-src', function () {
  return gulp.src([files.src])
    .pipe(eslint())
    .pipe(eslint.format())
  ;
});


/**
 * Unit Testing using Mochify
 */

gulp.task('test', function () {
  var b = mochify(files.test, {
    colors: true,
    debug: args.inspect,
    reporter : args.reporter,
    cover    : args.coverage,
    watch    : args.isWatching,
    transform : 'babelify'
  })
  .bundle();

  return b;
});


