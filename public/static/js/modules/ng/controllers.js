function guiid(){
	return [1,2,3].map(function(){ return (Math.random()*1000)>>0}).join('-');
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

function map(data){
	return _.map(data, function(field, i){
		field.hidden = true;
		field.index = i;
		return field;			
	});
}

pudra.controllers.mainCtrl = function($scope){
	var $timeout = pudra.inject('$timeout');

	debugger;
	
	// setInterval(function(){

	// })

	$scope.tablewidth = 480;
	$scope.phonenum = "8-800-775-1060";
	$scope.pattern = "http://pudra.ru/skins/pudra/mail/email_letter/img/textures/background.png";

	$scope.settings = {
		height: "390px",
	}

	pudra.api.http.get('fields').map(map).watch().bindTo($scope, 'fields');
	

	$scope.saveFile = function(){
		pudra.api.http.post('fields:save', {fields: $scope.fields});
	}

	$scope.loadFile = function(){
		pudra.api.http.get('fields:load');
	}

	$scope.switchField = function(f){
		f.hidden = ! f.hidden;
	}

	$scope.sortListBy = function(order){
		$scope.fields.sort(function(a, b){
			return order.indexOf(a.id) > order.indexOf(b.id) ? 1 : -1;
		});

		$scope.fields = _.map($scope.fields, function(e, i){
			e.index = i;
			return e;
		});

		console.log(_.map($scope.fields, function(e, i){
			return {
				'index' : e.index,
				'name' : e.name
			}
		}))
	}

	$scope.changeQuantity = function(field){
		field.quantity = !field.quantity;
		field.quantity = field.quantity ? 1 : 0;
		field.name = field.data[field.quantity ? 'plural' : 'singular'].name;
	}

	$scope.copy = function(field){
		var newField = {},
			index = field.index;

		for(var i in field){
			if(field.hasOwnProperty(i)){
				newField[i] = clone(field[i]);
			}
		}
		
		
		for(var i = field.index+1; i<$scope.fields.length;i++ ){
			$scope.fields[i].index += 1;
		}

		newField.id = guiid();
		delete newField.$$hashKey;
		$scope.fields = $scope.fields.slice(0, index).concat([newField]).concat($scope.fields.slice(index))


	}

	$scope.remove = function(field){
		if(typeCount(field.type, $scope.fields) == 1){
			$scope.fields[field.index].disabled = !$scope.fields[field.index].disabled;
		}else{
			$scope.fields.splice(field.index, 1);
			for(var i = field.index+1; i<$scope.fields.length;i++ ){
				$scope.fields[i].index -= 1;
			}			
		}
	}

}