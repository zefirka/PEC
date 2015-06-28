pec.routes = {
	home : {
		route : ['/', '', 'home'],
		tpl : 'core.tpl'
	},

	templates: {
		route: ["/templates", "templates"],
		tpl: 'templates.tpl'
	},

	'404' : {
			controller : 'notFoundCtrl',
			route : ['/404', '404'],
			tpl : 'pages/404.tpl',
	}
}
