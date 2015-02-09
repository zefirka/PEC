var lang =  require('../../../node/config/lang.js').init(require('../../../node/config/config.js').lang);

module.exports = [
	{
		type: 'text',
		pattern: "[A-Za-z][A-Za-z0-9\-\_\.]*",
		placeholder: lang("login_phd"),
		name : "u_name",
		css : 'b-login',
		_hiddenCase: "wasAuth"
	},
	{
		type: 'text',
		pattern: "[A-Za-z][A-Za-z0-9\-\_\.]*",
		placeholder: lang("Your Login"),
		name : "u_login",
		css : 'b-login',
		_showCase: "wasAuth"
	},
	{
		type: 'email',
		placeholder: lang("Email"),
		name : "u_email",
		_hiddenCase: "wasAuth"
	},
	{
		type: 'password',
		pattern: "[A-Za-z][A-Za-z0-9\-\_\.]*",
		placeholder: lang("password_phd"),
		name : "u_pwd"
	},
	{
		type: 'password',
		pattern: "[A-Za-z][A-Za-z0-9\-\_\.]*",
		placeholder: lang("password_phd"),
		name : "u_pwd2",
		_hiddenCase: "wasAuth"
	}
]