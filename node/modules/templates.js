var	fs 			 			= require('fs'),
		jsonfile      = require('jsonfile'),
		R 						= require('ramda'),
		config 				= require('../config/config.js');

var templates = {},
    fileName = __dirname + "/../" + config.files + "templates.json",
		defaultWrapper = __dirname + "/../../public/jade/template/defaultWrapper."

function exist(name){
	return function(array){
		return R.filter(R.propEq('name', name), array).length > 0;
	}
}

function mask(name, value) {
	return R.map(function(template){
		return template.name == name ? value : template;
	})
}

function max(){
	return parseInt(templates.reduce(function(a,b) {
		return parseInt(a.id) > parseInt(b.id) ? a : b;
	}).id);
}

function check(err){
	if(err){
		console.log(err);
	}
}

module.exports = {

	/* GET: load */
  load: function(response, next) {
		jsonfile.readFile(fileName, function(err, obj) {
			check(err);

			templates = obj;
			response.send(templates);
			next();
		});
  },

	/* POST: creat new template wrapper */
	createTemplateWrapper : function (params, callback) {
		var template = JSON.parse(params.template),
				file = __dirname + "/../../public/files/" + template.name + "/wrapper." + template.templates

		fs.createReadStream(defaultWrapper + template.templates)
			.pipe(fs.createWriteStream(file))
			.on("close", function(e){
				callback();
			});
	},

  save: function (params, callback) {
    var tpl = JSON.parse(params.template),
				name = tpl.name;

		/* If name exists then we'r updating */
    var isUpdate = exist(name)(templates);

    if(isUpdate){
			templates = mask(name, tpl)(templates);
    }else{
			tpl.id = max() + 1;
      templates.push(tpl);
    }

		this.write(callback);
  },

  remove: function (params, callback) {
    var name = JSON.parse(params.template).name || "";

    templates = templates.filter(function(tpl){
      return tpl.name !== name;
    });

    this.write(callback);
  },

  update: function (params, callback) {
		templates = mask(params.name, JSON.parse(params.template))(templates);

		this.write(callback);
  },

  choose: function (params, callback) {
    var template = JSON.parse(params.template);
				blocks = jsonfile.readFileSync(__dirname + "/../" + config.files + template.name + "/blocks.json");

		return callback({
			template: template,
			blocks : blocks
		});
  },

  write : function(callback){
    jsonfile.writeFile(fileName, templates, function (err) {
      check(err);

			/* Sending templates */
			callback(templates);
    });
  }
}
