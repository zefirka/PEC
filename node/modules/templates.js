var	jsonfile      = require('jsonfile'),
		config 		= require('../config/config.js');

var templates = {},
    fileName = __dirname + "/../" + config.files + "templates.json";

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
    var tpl = JSON.parse(params.template),
				name = tpl.name;

		/* If name exists then we'r updating */
    var isUpdate = templates.filter(function(tpl){
      return tpl.name == name;
    }).length > 0;

    if(isUpdate){
			templates = templates.map(function(template){
				return template.name = name ? tpl : template;
			});
    }else{
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
		var tpl = JSON.parse(params.template),
				name = params.name;

		templates = templates.map(function(template){
			return template.name == name ? tpl : template;
		});

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
			console.log("Sending:", templates)
			callback(templates);
    });
  }
}
