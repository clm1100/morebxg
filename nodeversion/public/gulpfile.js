var gulp = require('gulp');
var minify = require('gulp-minify');

var arr = [
	'assets/js/*/*.js'
]

gulp.task('default', function() {
  gulp.src(arr)
  .pipe(minify())
  .pipe(gulp.dest('build'));
});