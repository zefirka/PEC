var pkg = require('../../package.json'),
	config = require('../../node/config/config.js');

var scSrc = config.vendor,
	stSrc = config.static.adr,
	stStyles = stSrc + 'styles/css/',
	stScripts = stSrc + 'js/'


var scripts = [
		scSrc + "angular/angular.min.js",
		scSrc + "angular/angular-route.min.js",
		scSrc + "angular/angular-cookies.min.js",
		scSrc + 'angular-sanitize/angular-sanitize.min.js',		
		scSrc + "jquery/jquery.min.js",
		scSrc + "jquery/jquery-ui.min.js",
		scSrc + "jquery/jquery.sticky.js",
		scSrc + 'warden/warden.js',
		stScripts + "app/bootstrap.js",
		stScripts + 'app/app.js',
		stScripts + 'app/launcher.js'
	],
	styles = [
		stStyles + 'bootstrap.css',
		stStyles + 'main.css'
	]



module.exports = { 
	title: pkg.name + " " + pkg.version, 
	
	language: 'en-EN',
	viewport: config.meta.viewport,
	description: config.meta.description,
	
	favicon: "/favicon.ico",

	scripts: scripts,
	styles : styles,
}