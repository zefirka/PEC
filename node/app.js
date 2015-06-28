var	express 			= require('express'),
		favicon 			= require('serve-favicon'),
		bodyParser 		= require('body-parser'),
		morgan     		= require('morgan'),
		warden 				= require('warden.js'),
		jade 					= require('jade'),
		cookieParser 	= require('cookie-parser'),
		auth 					= require('http-auth'),
		R 						= require('ramda'),
		url 					= require('url'),
		color; 				// inited only in dev mode


var fs				= require('fs'),
		pkg 			= require('../package.json'),
		config 		= require('./config/config.js'),
		utils 		= require('./utils.js');


var CHOOSEN = null;

for(var i in warden.Utils){
	utils[i] = warden.Utils[i]; //relinking utils
}

function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

var app = express(),
		env = process.env.NODE_ENV || 'development',
		currentFile = config.default_file,
		port = config.port;

/* In case if want to use custom port */
process.argv.forEach(function(arg){
	if(arg.indexOf("-p")>=0){
		port = parseInt(arg.split('=').pop())
	}

	if(arg.indexOf("-d")>=0){
		currentFile = arg.split('=').pop();
	}
});


/* Configure middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());


/* Setting of HTTP-AUTH */
app.use(auth.connect(auth.basic({
    realm: "Enter password",
    file: __dirname + "/users.htpasswd" // CVS File of passwords
})));


/* Jade configuration */
app.set('views', config.root + config.views);
app.set('view engine', 'jade');
app.engine('jade', jade.__express);

if(env == 'development'){
	colors = require('colors');
	/* configuration for development */

	/* Configure morgan */
	if(config.dev.logMorgan){
		app.use(morgan('dev'));
	}

	/* Proxy configuration */
	app.set('trust proxy', 'loopback, 127.0.0.1');

	if(config.dev.logTime){
		app.use(function (req, res, next) {
	  		console.log('Request time:', Date.now());
	  		next();
		});
	}
}

/* Useragent enviroment configuration */
app.use(favicon(config.meta.favicon));
app.use(express.static(config.root));

/* Main route */
app.get('/', function (req, res) {
  res.render('index.jade', utils.extend({}, config, require(config.controllers + 'index.js')));
});

/* Getting templates and blocks */
app.get('/api?*', nocache, function(req, res, next) {
	var originalUrl = req.url,
			namespace = originalUrl.split('?').pop(),
			url_parts = url.parse(req.url, true);
			params = url_parts.query;

	if(params.domain == "templates"){
			require("./modules/templates.js").load(res, next);
	}
});

app.post('/api?*', function (req, res, next) {
	var originalUrl = req.url,
			namespace = originalUrl.split('?').pop(),
			url_parts = url.parse(req.url, true),
			params = url_parts.query,
			callback = null;

	if(params.domain == "templates"){
		var actor = require("./modules/templates.js");


		/* Слишком обобщенный */

		if(params.action == "choose"){
			callback = function(response){
				CHOOSEN = JSON.parse(response);
				res.send(response);
				next();
			}
		}else{
			callback = function(response){
				res.send(response);
				next();
			}
		}
		actor[params.action](params, callback);
	}

});


app.get('/*.tpl', function (req, res, next) {
	var originalUrl = req.params[0],
			url = originalUrl.split('/'),
			name = url.pop(),
			resolveName,
			model,
			data,
			engine = config.tplEngine,
			file;

	if(url[0] == 'files'){
		engine = CHOOSEN.templates;
		file = config.root + originalUrl + '.' + engine;

		console.log("SEARCHING", file);
		fs.stat(file, function(err){
			if(err){
				res.render('pages/404.' + config.tplEngine);
			}else{
				if(engine == "jade"){
					res.render(file);
				}else{
					fs.readFile(file, {encoding: 'utf-8'}, function(err, data){
						res.send(data);
						next();
					});
				}
			}
		});
	}else{
		try{
			name = utils.retrive(url, name, config.tplEngine);
		}catch(e){
			console.log("Error: ", e);
		}finally{
			fs.stat(config.root + config.views + name + '.' + config.tplEngine, function(err){
				if(err){
					res.render('pages/404.' + config.tplEngine);
				}else{
					res.render(name + '.' + config.tplEngine);
				}
				next();
			});
		}
	}
});

var server = app.listen(port, function () {
  	var host = server.address().address,
  		port = server.address().port;

  	console.log('App listening at http://%s:%s', host, port);

});
