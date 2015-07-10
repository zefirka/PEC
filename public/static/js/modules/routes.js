pec.routes = {
	home : {
		route : ['/', '', 'home'],
		tpl : 'pages/dashboard.tpl'
	},

	about: {
		route: ["/about", "about"],
		tpl: 'pages/about.tpl'
	},

	'404' : {
			controller : 'notFoundCtrl',
			route : ['/404', '404'],
			tpl : 'pages/404.tpl',
	}
}
