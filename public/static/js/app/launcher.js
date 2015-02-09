'use strict';
var App = angular.module('pudra',['ngRoute', 'ngSanitize', 'ngCookies'], function($routeProvider, $compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|callto):/);		
}).run();

(function(app){
	/* Initialization of Angular app particles */	
	function dolist(app, base, method){
		for(var key in base) {
			var value = base[key];
			app[method](key, method == 'controller' ? value : value());
		}
	}

	/* Controllers*/
  	dolist(app, pudra.controllers, 'controller');	

	/* Directives*/
	dolist(app, pudra.directives, 'directive');	
	
	/* Filters*/
	dolist(app, pudra.filters, 'filter');	
})(App);