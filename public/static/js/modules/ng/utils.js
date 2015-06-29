function guiid(){
	return [0,0,0,0].map(function(){ return (Math.random()*1000)>>0}).join('-');
}

function typeCount(type, arr){
	return _.filter(arr, function(f){
		return f.type == type;
	}).length
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function clean(obj, val){
	for(var i in obj){
		if(_.is.obj(obj[i])){
			obj[i] = clean(obj[i], val);
		}else{
			obj[i] = val || '';
		}
	}
	return obj;
}

function mapIndex(data){
	return _.map(data, function(field, i){
		field.hidden = true;
		field.index = i;
		return field;
	});
}

function JSON2Fields(field){
	var res = {};

	field = angular.copy(field);

	for(var name in field){
			if(name != "$$hashKey"){
				res.name = name;
			}
	}

	field = field[res.name];

	res.type = field.type;

	if(field.options){
		res.options = field.options;
	}

	delete field.options;
	delete field.type;

	for(var option in field){
		res[option] = field[option];
	}

	return res
}

function tpl2json(tpl) {
	var t = angular.copy(tpl);
	t.variables = t.variables.map(function (field) {
		var res = {},
				name = field.name

		res[name] = {};

		field = angular.copy(field);

		delete field.$$hashKey;
		delete field.name;

		for(var o in field){
			res[name][o] = field[o];
		}

		return res;

	});
	return t;
}

function maxId(a,b) {
		return parseInt(a.id) > parseInt(b.id) ? a : b;
}
