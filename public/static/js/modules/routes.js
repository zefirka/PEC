pec.routes = {
	home : {
		route : ['/', '', 'home'],
		tpl : 'pages/static/index.tpl',
		controller : 'indexCtrl',
	},

	dashboard: {
		route: ["/dashboard", "dashboard"],
		tpl: 'dashboard/dashboard.tpl',
		controller : 'mainCtrl',
	},

	constructor: {
		route: ['dashboard/email'],
		tpl: 'dashboard/constructor.tpl'
	},

	'404' : {
			controller : 'notFoundCtrl',
			route : ['/404', '404'],
			tpl : 'pages/404.tpl',
	}
}
