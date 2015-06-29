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
