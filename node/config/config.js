var root 		= __dirname + "/../../public/",
	_public 	= "../public/";

module.exports = {
	root : root, //the root of the project
	
	/* Language configs */
	deflang : 'en', //default language
	lang: 'en', //current language
	
	/* Meta tags */
	meta : {
		viewport : {
			initialScale : 1,
			userScalable : "no",
			initialScaleDouble : 1.0,
			maximumScaleDouble : 1.0
		},
		favicon : root + 'favicon.ico',
		description : "Pudra",
	},
		
	tplEngine : 'jade', // template engine
		
	views	: "jade/",
	controllers :  root + "controllers/",
	vendor 	: "libs/",
	dependencies : "dependencies.js",
	
	isAuth : true, // DEBUG
	
	front : 'public/',
	back : 'node/',
	
	'static' : {
		adr : 'static/',
		images : 'img/',
		scripts: "js/" ,
		styles: "styles/css",
	},

	/* Development */
	dev : {
		logTime : false
	}
}