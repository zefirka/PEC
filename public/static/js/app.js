(function(root) {

	var _ = Warden.Utils;
	var pec = {
		consts : {
			$window: $(window)
		},
		static : 'views/',
		bootstrap : Bootstrap,
		routes: {},
		functional : {},
		api : {},
		events: Warden({}),
		controllers : {},
		directives : {},
		filters : {},
		transforms : {}

	}

	/* Function returns controller */
	pec.getController = function(route){
		var c = pec.controllers[route.controller] || pec.controllers[route.name] || pec.controllers[route.route];
		return typeof route.controller == 'function' ? route.command : c;
	}


	//= include modules/routes.js
	//= include modules/ng/utils.js
	//= include modules/ng/functional.js
	//= include modules/ng/controllers.js
	//= include modules/ng/directives.js
	//= include modules/ng/filters.js
	//= include modules/ng/factories.js
	//= include modules/ng/transforms.js


	root.pec = pec;
	root._ = _;
})(this);
