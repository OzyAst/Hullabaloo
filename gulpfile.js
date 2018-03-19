var gulp = require('gulp');
// Сжатие CSS
var csso = require('gulp-csso');
// Сжатие JS
var uglify = require('gulp-uglifyes');

gulp.task('default', function(done){
  console.log("please write 'gulp build'");
  done();
});

gulp.task('csso', function () {
    return gulp.src('./css/hullabaloo.css')
        .pipe(csso())
        .pipe(gulp.dest('./css/'));
});

gulp.task('uglifyes', function () {
  return gulp.src('./js/hullabaloo.js')
    .pipe(uglify())
    .pipe(gulp.dest('./js/'))
});

gulp.task("build", gulp.series(gulp.parallel('uglifyes', 'csso')));
