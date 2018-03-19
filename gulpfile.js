var gulp = require('gulp');
// Сжатие CSS
var csso = require('gulp-csso');
// Сжатие JS
var uglify = require('gulp-uglifyes');
// Переименование
var rename = require("gulp-rename");

gulp.task('default', function(done){
  console.log("please write 'gulp build'");
  done();
});

// CSS
gulp.task('csso', function () {
    return gulp.src('./css/hullabaloo.css')
        .pipe(csso())
        .pipe(rename("./css/hullabaloo.min.css"))
        .pipe(gulp.dest('./'));
});

// JS
gulp.task('uglifyes', function () {
  return gulp.src('./js/hullabaloo.js')
    .pipe(uglify())
    .pipe(rename("./js/hullabaloo.min.js"))
    .pipe(gulp.dest('./'))
});

gulp.task("build", gulp.series(gulp.parallel('uglifyes', 'csso')));
