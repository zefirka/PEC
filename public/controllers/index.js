var pkg = require('../../package.json'),
		config = require('../../node/config/config.js');

var scSrc = config.vendor,
	stSrc = config.static.adr,
	stStyles = stSrc + 'styles/css/',
	stScripts = stSrc + 'js/'


var scripts = [
		scSrc + "angular/angular.min.js",
		'https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.3.7/angular-route.min.js',
		scSrc + 'angular-sanitize/angular-sanitize.min.js',
		'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.7/angular-cookies.js',
		scSrc + "jquery/dist/jquery.min.js",
		scSrc + "jquery/dist/jquery-ui.min.js",
		scSrc + 'warden/warden.js',
		stScripts + "app/bootstrap.js",
		stScripts + 'app/app.js',
		stScripts + 'app/launcher.js'
	],
	styles = [
		stStyles + 'bootstrap.css',
		//stStyles + 'style.css',
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