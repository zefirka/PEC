var	jsonfile      = require('jsonfile'),
		R 						= require('ramda'),
		config 				= require('../config/config.js');

var templates = {},
    fileName = __dirname + "/../" + config.files + "templates.json";

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

module.exports = {
  load: function(response, next) {
		jsonfile.readFile(fileName, function(err, obj) {
		  if(err){
				console.log(err);
			}
			templates = obj;
			response.send(templates);
			next();
		});
  },

  save: function (params, callback) {
    var templ = JSON.parse(params.template),
				name = tpl.name;

		/* If name exists then we'r updating */
    var isUpdate = exist(tpl.name)(templates);

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
    return callback(params.template);
  },

  write : function(callback){
    jsonfile.writeFile(fileName, templates, function (err) {
      if(err){
				console.error(err);
			}

			/* Sending templates */
			callback(templates);
    });
  }
}
