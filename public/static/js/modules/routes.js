pudra.routes = {
	home : {
		route : ['/', '', 'home'],
		tpl : 'core.tpl'
	},
	
	login : {
		route : 'login',
		tpl : 'pages/login.tpl'
	},
	
	dashboard : {
		route : 'dashboard',
		tpl: 'dashboard.tpl'
	},
	
	about : {
		route : 'about',
		tpl: 'about.tpl'
	},

	into : {
		route : 'intro',
		tpl : 'pages/intro.tpl'
	},

	copyright : {
		route : 'copyright',
		tpl: 'copyright.tpl'
	},

	'404' : {
			controller : 'notFoundCtrl',
			route : ['/404', '404'],
			tpl : 'pages/404.tpl',
	}
}