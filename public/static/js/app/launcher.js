'use strict';
var App = angular.module('pudra',['ngRoute', 'ngSanitize', 'ngCookies', 'warden-angular-bridge'], function($routeProvider, $compileProvider){
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

(function(ng) {
    var wardenModule = ng.module('warden-angular-bridge', []);

    wardenModule.config(['$provide', function($provide) {
        $provide.decorator('$rootScope', ['$delegate', function($delegate) {

            Object.defineProperties($delegate.constructor.prototype, {
                '$stream': {
                    value: function(watchExpression) {
                        var scope = this,
                            stream = Warden.makeStream(function(emit){    
                                scope.$watch(watchExpression, function(n, o){
                                    emit({
                                        newValue : n,
                                        oldValue : o
                                    });
                                });
                            }, scope).bus().watch();

                        scope.$on('$destroy', function(){
                            stream.lock();
                        });

                        return stream;
                    },
                    enumerable: false
                }
            });

            return $delegate;
        }]);
    }]);
})(angular);

$(function(){
    $('#structure').sticky({topSpacing:10})    
});
