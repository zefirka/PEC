var lang =  require('../../node/config/lang.js').init(require('../../node/config/config.js').lang),
	extend = require('util')._extend;

var res = {
	nav: [
		{
			name: lang('Home'),
			link: "#/home"
		},
		{
			name: lang('Dashboard'),
			link: '#/dashboard'
		},
		{
			name: lang('Login'),
			link: '#/login'
		},
		{
			name: lang('Introduction'),
			link: '#/intro'
		}
	],
	footer: [
		{
			name: lang('About'),
			link: "#/about"
		},
		{
			name: lang('Copyright'),
			link: "#/copyright"
		},
		{
			name: lang('Partnership'),
			link: '#/partners'
		},
		{
			name: lang('Contacts'),
			link: '#/contacts'
		}
	]
}

extend(res, require("./meta/about.js"));

module.exports = res; 
