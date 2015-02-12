var express 		= require('express'),
	favicon 		= require('serve-favicon'),
	bodyParser 		= require('body-parser'),
	morgan     		= require('morgan'),
	warden 			= require('warden.js'),
	jade 			= require('jade'),
	cookieParser 	= require('cookie-parser'),
	color; 		// inited only in dev mode
	

var fs			= require('fs'),
	pkg 		= require('../package.json'),
	config 		= require('./config/config.js'),
	sitemap 	= require('./config/dependencies.js'),
	utils 		= require('./utils.js');

for(var i in warden.Utils){
	utils[i] = warden.Utils[i]; //relinking utils
}

var app = express(),
	env = process.env.NODE_ENV || 'development';


/* Configure middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/* Jade configuration */
app.set('views', config.root + config.views);
app.set('view engine', 'jade');
app.engine('jade', jade.__express);

if(env == 'development'){
	colors = require('colors'); 
	/* configuration for development */
	
	/* Configure morgan */
	app.use(morgan('dev'));

	/* Proxy configuration */ 
	app.set('trust proxy', 'loopback, 127.0.0.1');
	
	app.use(function (req, res, next) {
  		console.log('Request time:', Date.now());
  		next();
	});
}

/* Useragent enviroment configuration */
app.use(favicon(config.meta.favicon));
app.use(express.static(config.root));

/* Configure browser user-agent prop and cookies */
app.use(function(req, res, next){
	config.userAgent = utils.uaDetect(req);
	console.log('isAuth: '.green + config.isAuth.green);
	config.isAuth = config.isAuth ===  true ? true : utils.is.exist(req.cookies.sessionID);
	config.wasAuth =  utils.is.exist(req.cookies.hashcode);
	next();
});



app.get('/', function (req, res) {
  res.render('index.jade', utils.extend({}, config, require(config.controllers + 'index.js')));
});

app.get('/api?*', function (req, res, next) {
	var originalUrl = req.url,
		namespace = originalUrl.split('?').pop(),
		data;



	if(namespace.indexOf("load")>=0){
		fs.readFile(config.controllers + "files/" + namespace.split(':')[0] + ".json", {encoding: 'utf-8'}, function(err, val){ 
			if(err){
				console.error(err)
			}else{
				res.send({
					type: 'load',
					data : JSON.parse(val)
				});
				next();	
			}			
		});
	}else{
		res.send({
			type: 'load',
			data: require(config.controllers + "api/" + namespace + ".js")
		});
		next();
	}	
});

app.get('/searc*', function (req, res, next) {
	res.send({
		type: 'search',
		sielent : true,
		results: ['alpha', 'beta', 'gamma']
	});
	next();
});

app.post("/api?*", function (req, res, next){
	var originalUrl = req.url,
		namespace = originalUrl.split('?').pop(),
		data;

	if(namespace.indexOf("save")>=0){
		console.log("Writing file: " + config.controllers + "files/fields.json");

		var fields = req.body.fields;
		fs.writeFile(config.controllers + "files/fields.json", JSON.stringify(fields), function(err) {
		    if(err) {
		        console.log(err);
		    } else {
		        res.send({
		        	sielent: req.body.sielent || false,
		        	message: "Файл сохранен успешно."
		        });
		        next();
		    }
		}); 
	}
});

app.get('/*.tpl', function (req, res, next) {
	var originalUrl = req.params[0],
		url = originalUrl.split('/'),
		name = url.pop(),
		resolveName,
		model,
		data;
	
	name = utils.retrive(url, name, config.tplEngine);
	model = {};
	
	try{
		model = require(config.controllers + name + ".js");
	}catch(err){
		resolveName = utils.resolveUrl(name.split('/').pop(), sitemap, true) || 'core';
		model = require(config.controllers + resolveName + ".js");
	}
	
	data = utils.extend({}, config, model);
	
	fs.stat(config.root + config.views + name + '.' + config.tplEngine, function(err){
		if(err){
			res.render('pages/404.' + config.tplEngine, data);
		}else{
			res.render(name + '.' + config.tplEngine, data);
		}
		next();
	});
});

var server = app.listen(3002, function () {
  	var host = server.address().address,
  		port = server.address().port;

  	console.log('App listening at http://%s:%s', host, port);

});