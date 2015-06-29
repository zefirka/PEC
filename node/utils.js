var utils = require('warden.js').Utils;

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

function retrive(url, name, prevent){
	var last = url.pop();
	if(last!==prevent){
		name = [last, name].join('/');
		return this.retrive(url, name, prevent);
	}
	return name;
}

module.exports = {
	uaDetect : userAgentDetector,

	/* Takes filename from url to prevent directory */
	retrive: retrive,

	/* Resolve parent url from dependencies tree */
	resolveUrl: function(name, deps, debug){
		var	look = function(obj, prev){
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
	},

	/* Extends object */
	extend : require('util')._extend
}
