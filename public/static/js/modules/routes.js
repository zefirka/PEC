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

	'dashboard/templates/new': {
		route: ['dashboard/templates/new'],
		tpl: 'dashboard/edit.tpl',
		controller : 'editTemplate',
	},

	'dashboard/templates/edit/:id': {
		route: ['dashboard/templates/edit/:id'],
		tpl: 'dashboard/edit.tpl',
		controller : 'editTemplate',
	},

	'dashboard/templates/delete/:id': {
		route: ['dashboard/templates/delete/:id'],
		tpl: 'dashboard/delete.tpl',
		controller : 'deleteTemplate',
	},

	'dashboard/templates': {
		route: ['dashboard/templates'],
		tpl: 'dashboard/templates.tpl',
		controller : 'templatesList'
	},

	'dashboard/constructor': {
		route: ['dashboard/constructor'],
		tpl: 'dashboard/constructor.tpl'
	},

	'404' : {
			controller : 'notFoundCtrl',
			route : ['/404', '404'],
			tpl : 'pages/404.tpl',
	}
}
