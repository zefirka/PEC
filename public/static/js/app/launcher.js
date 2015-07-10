'use strict';
var App = angular.module('pecApp',['ngRoute', 'ngSanitize', 'ngCookies'], function($routeProvider, $compileProvider){
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|callto):/);
	// 
	// for(var pageName in pec.routes){
  //   	var route = pec.routes[pageName],
	// 		tpl = route.tpl,
	// 		page = route.route,
	// 		templateUrl = pec.static + tpl;
	//
	// 	if(typeof page !== 'object'){
	// 		page = [page];
	// 	}
	//
	// 	page.forEach(function(pagen){
	// 		$routeProvider.when("/" + pagen, {
	// 			templateUrl: templateUrl,
	// 			controller: pec.getController(route),
	// 			pageName: page
	// 		});
	// 	});
	// }
	//
	// $routeProvider.when("/", {
	// 	redirectTo: "/home"
	// }).otherwise({
	// 	redirectTo: "/404"
	// });

}).run();

(function(app){
	/* Initialization of Angular app particles */
	function dolist(app, base, method){
		for(var key in base) {
			var value = base[key];
			app[method](key, method == 'controller' ? value : value());
		}
	}

	/* Directives*/
	dolist(app, pec.directives, 'directive');

	/* Filters*/
	dolist(app, pec.filters, 'filter');

	/* Controllers*/
  dolist(app, pec.controllers, 'controller');

	/* Factories*/
	dolist(app, pec.factories, 'factory');
})(App);
