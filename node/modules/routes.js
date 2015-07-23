var config = require('../config/config.js'),
		utils = require('../utils.js');

// should export
var static = ['about', 'api'];


module.exports = {
	init: function(app){
		static.forEach(function(route){
			app.get('/' + route, function(req, res){
				var data = utils.getCtrl('index', route);
				res.render('pages/static/' + route + '.' + config.tplEngine, data);
			})
		})
	}
}
