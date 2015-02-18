var _ = Warden.Utils;


var pudra = {
	static : 'public/static/jade/',
	bootstrap : Bootstrap,
	routes: {},
	functional : {},
	api : {},
	
	controllers : {},
	directives : {}
	
}

/* Function returns controller */
pudra.getController = function(route){
	var c = pudra.controllers[route.controller] || pudra.controllers[route.name] || pudra.controllers[route.route]; 
	return typeof route.controller == 'function' ? route.command : c; 
}

//= include modules/ng/utils.js
//= include modules/ng/functional.js
//= include modules/ng/controllers.js
//= include modules/ng/directives.js