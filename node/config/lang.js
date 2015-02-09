var map;

module.exports = {
	init : function(code){
		try{
			map = require('../../etc/lang/' + code + '.json');
			return function(c){
					return map[c] || c;	
			}
		}catch(err){
			return function(c){
				return c;
			}
		}
	}
}