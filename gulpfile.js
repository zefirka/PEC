/* GULP modules */
var gulp    = require('gulp'),
    bower   = require('gulp-bower'),
    less    = require('gulp-less'),
    watch   = require('gulp-watch'),
    include = require('gulp-include');

function task(name, fn){
  return function(){
    console.log("Apply task: " + name);
    console.log("___________________________________________")
    fn.apply(null, arguments)
  }
}

/* Misc */
var pkg     = require('./package.json');


gulp.

task('bower', task('bower', function() {
  return bower({
    directory : pkg.front + 'libs'
  });
})).

task('less:main', task('less:main', function () {

  var stat  = pkg.front + 'static/',
      src   = stat + 'styles/less/main.less',
      dest  = stat + "styles/css"
  try{
    gulp.src(src)
        .pipe(less())
        .pipe(gulp.dest(dest));
  }catch(err){
    console.log("Error: ", err);
  }
})).

task('less:bootstrap', function () {
  var stat =  pkg.front + 'static/',
      src = stat + 'styles/less/bootstrap.less',
      dest = stat + "styles/css";

  try{
    gulp.src(src).pipe(less()).pipe(gulp.dest(dest));
  }catch(err){
    console.log(err);
  }
}).

task('less', ['less:main', 'less:bootstrap']).
task('styles', ['less']).

task("scripts:build", task('Building scripts', function() {
  gulp.src(pkg.front + 'static/js/app.js')
      .pipe( include() )
      .pipe( gulp.dest(pkg.front + 'static/js/app/'))
})).

task('scripts', ["scripts:build"]).

task('default', function() {
  gulp.watch(pkg.front + 'static/styles/less/**/*.less', ['less']);
  gulp.watch(pkg.front + 'static/js/modules/routes.js', ['scripts:build']);
  gulp.watch(pkg.front + 'static/js/modules/ng/**/*.js', ['scripts:build']);
});
