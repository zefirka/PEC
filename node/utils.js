var w_utils = require('warden.js').Utils,
    config  = require('./config/config.js'),
		lang = require('./config/lang.js').init(config.language);

/*
    User Agent Detection function.
    Gets user-agent info from request headers
*/
function userAgentDetector(ua){
  var $ = {};

  if (/mobile/i.test(ua))
      $.Mobile = true;

  if (/like Mac OS X/.test(ua)) {
      $.iOS = /CPU( iPhone)? OS ([0-9\._]+) like Mac OS X/.exec(ua)[2].replace(/_/g, '.');
      $.iPhone = /iPhone/.test(ua);
      $.iPad = /iPad/.test(ua);
  }

  if (/Android/.test(ua))
      $.Android = /Android ([0-9\.]+)[\);]/.exec(ua)[1];

  if (/webOS\//.test(ua))
      $.webOS = /webOS\/([0-9\.]+)[\);]/.exec(ua)[1];

  if (/(Intel|PPC) Mac OS X/.test(ua))
      $.Mac = /(Intel|PPC) Mac OS X ?([0-9\._]*)[\)\;]/.exec(ua)[2].replace(/_/g, '.') || true;

  if (/Windows NT/.test(ua))
      $.Windows = /Windows NT ([0-9\._]+)[\);]/.exec(ua)[1];

  return $;
}

/* */
function retrive(route, name){
  route.forEach(function(dir){
    name = dir + '/' + name;
  });
  return name;
}

/* */
function heach(map, fn) {
  for(var i in map){
    if(map.hasOwnProperty(i)){
      fn(map[i], i);
    }
  }
}

/* */
function resolveUrl(name, deps, debug){
  function look(obj, prev){
    for(var key in obj){
      if(obj.hasOwnProperty(key) && key==name){
        return prev;
      }else
      if(utils.is.obj(obj[key])){
        return look(obj[key], key);
      }
    }
  }

  return look(deps, deps[name]);
}

function debug(str, data) {
  if(config.env == 'dev'){
    console.log(utils.interpolate(str, data));
  }
}

function getCtrl(){
	var data = {},
			langData = lang('common'),
      ctrls = w_utils.toArray(arguments);

  data = ctrls.reduce(function(scData, controller){
    var res = null;
    try{
			langData = w_utils.extend(langData, lang(controller));
      res =  w_utils.extend(scData, require(config.controllers + controller + '.js'))
    }catch(error){
      res = w_utils.extend(scData, {errors: [error] });
      res.isError = true;
    }finally{
			// console.log(res);
      return res;
    }
  }, {});

  return w_utils.extend({}, config, data, {lang: langData});
}


var utils = {
  uaDetect : userAgentDetector,
  heach: heach,
  retrive: retrive,
  resolveUrl: resolveUrl,
  debug : debug,
  extend : require('util')._extend,
  getCtrl: getCtrl
}

heach(w_utils, function(util, name){
  utils[name] = util;
});

module.exports = utils;
