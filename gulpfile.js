/* GULP modules */
var gulp 		= require('gulp'),
	bower 		= require('gulp-bower'),
	less 		= require('gulp-less'),
	watch 		= require('gulp-watch'),
	include 	= require('gulp-include');

/* Misc */
var	pkg 			= require('./package.json');


gulp.

task('bower', function() {
	return bower({
		directory : pkg.front + 'libs'
  	});
}).

task('less:main', function () {
	var stat =  pkg.front + 'static/',
		src = stat + 'styles/less/main.less',
		dest = stat + "styles/css"
		try{
  		gulp.src(src).pipe(less()).pipe(gulp.dest(dest));
		}catch(err){
			console.log(err);
		}
}).

task('less', function(){
	gulp.run('less:main');
}).


task("scripts:build", function() {
	gulp.src(pkg.front + 'static/js/app.js')
		.pipe( include() )
		.pipe( gulp.dest(pkg.front + 'static/js/app/'));
}).

task('compile', function(){

}).

task('scripts', function(){
	gulp.run("scripts:build");
}).

task('styles', function(){
	gulp.run('less');
}).

task('default', function() {
	gulp.
		watch(pkg.front + 'static/styles/less/**/*.less', function() {  
			console.log('allahu akbar!');
    		gulp.run('less');
		});
	
	gulp.
		watch(pkg.front + 'static/js/modules/**/*.js', function(){
			gulp.run('scripts:build')
	});

	gulp.
		watch(pkg.front + 'static/js/modules/*.js', function(){
			gulp.run('scripts:build')
	});	
});