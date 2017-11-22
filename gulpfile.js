var gulp = require('gulp'),
  pug = require("gulp-pug"),
  replace = require("gulp-replace"),
  plumber = require("gulp-plumber");

//同步静态资源
gulp.task("static", function() {
  return gulp.src('src/static/**/*.*', {base:'src'})
    .pipe(gulp.dest('./'));
});

//编译pug模板
gulp.task("pug", function() {
  return gulp.src("src/view/**/*.pug", {base:'src/view'})
    //解决pug引擎编译错误时自动退出监听
    .pipe(plumber())
    .pipe(pug({pretty:true}))
    .pipe(replace(/\$\{relativePath\}\//g, function(match, p1) {
      var relative = this.file.relative.replace(/\\/g, "/");
      return relative.substr(0, relative.lastIndexOf("/") + 1)
        .substr(0, relative.lastIndexOf("/") + 1)
        .replace(/[^\/]+/g, "..");
    }))
    .pipe(gulp.dest("./"));
});

//监听文件变动将编译pug模板和同步静态资源
gulp.task("watch", function() {
  gulp.watch("src/**/*.*", ["static", "pug"]);
});

gulp.task("default", ["static", "pug", "watch"]);
