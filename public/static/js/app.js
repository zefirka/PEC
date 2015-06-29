(function(root) {

	var _ = Warden.Utils;
	var pec = {
		static : 'public/static/jade/',
		bootstrap : Bootstrap,
		routes: {},
		functional : {},
		api : {},
		events: Warden({}),
		controllers : {},
		directives : {},
		filters : {}

	}

	/* Function returns controller */
	pec.getController = function(route){
		var c = pec.controllers[route.controller] || pec.controllers[route.name] || pec.controllers[route.route];
		return typeof route.controller == 'function' ? route.command : c;
	}



	//= include modules/ng/utils.js
	//= include modules/ng/functional.js
	//= include modules/ng/controllers.js
	//= include modules/ng/directives.js
	//= include modules/ng/filters.js
	//= include modules/ng/factories.js


	root.pec = pec;
})(this);
