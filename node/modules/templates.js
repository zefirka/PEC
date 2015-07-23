var fs            = require('fs'),
    jsonfile      = require('jsonfile'), // will be changed to Mongoose
    R             = require('ramda'),
    config        = require('../config/config.js'),
    url           = require('url'),
		debug         = require("../utils.js").debug;

var FILE     = __dirname + "/../" + config.files + "templates.json",
    WRAPPER  = __dirname + "/../../public/jade/template/defaultWrapper."

var currentTemplate = null;

function existProp(prop, name){
  return function(array){
    return R.filter(R.propEq(prop, name), array).length > 0;
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

function onError(err, fn){
  if(err){
    if(fn){
      fn(err);
    }else{
      console.log(err);
    }
  }
}

var Module = {
  templates: {},
  current : null,

  /* Loads teamplates from file @FILE */
  load: function(_, res, next) {
    jsonfile.readFile(FILE, function(err, json) {
      onError(err);
      Module.templates = json;
      currentTemplate =
      res.send(Module.templates);
      next();
    });
  },

  /* Saves new template */
  save: function (data, res, next) {
    debug("Saving template");

    var params = req.body.params,
        tpl = JSON.parse(params.template),
        name = tpl.name,
        files = req.body.files;

    console.log(files);


    /* If property 'name' exists in 'templates' then we'r updating template */
    var isUpdate = existProp(name)(templates);

    if(isUpdate){
      templates = mask(name, tpl)(templates);
    }else{
      tpl.id = max() + 1;
      templates.push(tpl);
    }

    this.write(function(){
			res.send(Module.templates);
      next();
		});
  },

  remove: function (params, res, next) {
    var name = JSON.parse(params.template).name || "";

    Module.templates = Module.templates.filter(function(tpl){
      return tpl.name !== name;
    });

    this.write(function(){
			res.send(Module.templates);
			next();
		});
  },

  update: function (params, callback) {
    templates = mask(params.name, JSON.parse(params.template))(templates);

    this.write(callback);
  },

  choose: function (params, res, next) {
		var template = JSON.parse(params.template);
        blocks = jsonfile.readFileSync(__dirname + "/../" + config.files + template.name + "/blocks.json");

    res.send({
      template: template,
      blocks : blocks
    });

    Module.template = template;
    currentTemplate = template;
		next();
  },

  write : function(fn){
    jsonfile.writeFile(FILE, Module.templates, function (err) {
      onError(err)
      /* Sending templates */
			fn();
    });
  },

  chosen: function(){
    return currentTemplate;
  }
}

module.exports = Module;
