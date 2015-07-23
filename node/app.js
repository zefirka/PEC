var express         = require('express'),
    favicon         = require('serve-favicon'),
    bodyParser      = require('body-parser'),
    morgan          = require('morgan'),
    warden          = require('warden.js'),
    jade            = require('jade'),
    cookieParser    = require('cookie-parser'),
    auth            = require('http-auth'),
    url             = require('url'),
		fs              = require('fs'),
    color;          // inited only in dev mode

var pkg       = require('../package.json'),
    config    = require('./config/config.js'),
    utils     = require('./utils.js');

var Tmpl = require('./modules/templates.js'),
		Blocks = require('./modules/blocks.js'),
    Router = require('./modules/routes.js');

function nocache(_, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
}

var app = express();
var env = process.env.NODE_ENV || config.env || 'dev';

/* In case if want to use custom port */
process.argv.forEach(function(arg){
  if(arg.indexOf("-p")>=0){
    config.port = parseInt(arg.split('=').pop())
  }

  if(arg.indexOf("-d")>=0){
    config.currentTemplate = arg.split('=').pop();
  }
});

/* Configure middlewares */
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

/* Setting of HTTP-AUTH */
if(config.useHTTPAuth){
	app.use(auth.connect(auth.basic({
	    realm: "Enter password",
	    file: __dirname + "/users.htpasswd" // CVS File of passwords
	})));
}

/* Jade configuration */
app.set('views', config.root + config.views);
app.set('view engine', 'jade');
app.engine('jade', jade.__express);

/* configuration for development */
if(env == 'dev'){
  colors = require('colors');

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
  res.render('index.jade', utils.getCtrl('index'));
});

Router.init(app);

app.all('/templates?*', function (req, res, next) {
  var params = url.parse(req.url, true).query,
      data = req.body;
  console.log(req.body);
  Tmpl[params.action].call(Tmpl, params || data, res, next);
});


app.get('/files/*.tpl', function(req, res, next){
	var originalUrl = req.params[0],
			url = originalUrl.split('/'),
			name = url.pop(),
			engine = Tmpl.chosen().templates,
			file = config.root + originalUrl + '.' + engine;

  utils.debug("Searching template:", file, name);

  fs.stat(file, function(err){
		if(err){

			/* If we didn't find wrapper then we render wrapper.jade */
      res.render('errors/' + name + "." + config.tplEngine, Tmpl.template);

    }else{

      if(engine == "jade"){
				res.render(file, Tmpl.template);
      }else{
        fs.readFile(file, {encoding: 'utf-8'}, function(err, fileData){
          if(err){
						throw err;
					}

					res.send(utils.interpolate(fileData, Tmpl.template));
          next();
        });
      }
    }
  });
});

app.get("/views/*.tpl", function (req, res, next) {
	var originalUrl = req.params[0],
      name = originalUrl.split('/').pop(),
			path = originalUrl, ctrlName;


  try{
		ctrlName = name;
    // path = utils.retrive(route, name);
    // utils.debug('ROUTE: {{route}}, NAME: {{name}}, PATH: {{path}}', {route: route, path: path, name: name});
  }catch(e){
    console.log("Error: ", e);
  }finally{
		var file = config.root + config.views + path + '.' + config.tplEngine;

    fs.stat(file, function(err){
      if(err){
        res.render('pages/404.' + config.tplEngine, err);
      }else{
        res.render(path + '.' + config.tplEngine, utils.getCtrl(ctrlName));
      }
      next();
    });
  }

});

var server = app.listen(config.port, function () {
	var host = server.address().address,
    	port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
});
