pudra.controllers.mainCtrl = function($scope){
	var $interval = pudra.inject('$interval'),
		getFields = pudra.api.getType('load').map('.data'),
		timer;

	var setIndexes = function(){
		$scope.fields = $scope.fields.map(function(field, index){
			field.index = index;
			return field;
		});
	}
		
	$scope.tablewidth = 960;
	$scope.phonenum = "8-800-775-1060";
	$scope.pattern = "http://pudra.ru/skins/pudra/mail/email_letter/img/textures/background.png";
	$scope.settings = {
		height: "390px",
		autosave : false
	}

	getFields.map(mapIndex).watch().bindTo($scope, 'fields');	

	$scope.saveFile = function(sielent){
		pudra.api.http.post('fields:save', {
			sielent: sielent,
			fields: $scope.fields
		});
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

		setIndexes();
		
		console.log(_.map($scope.fields, function(e, i){
			return Warden.Utils.interpolate('Index : {{index}}, Name: {{name}}', e);
		}).join('\n'));

		$scope.$apply()
	}

	$scope.changeQuantity = function(field){
		field.quantity = !field.quantity;
		field.quantity = field.quantity ? 1 : 0;
		field.name = field.data[field.quantity ? 'plural' : 'singular'].name;
	}

	// Копирование поля
	$scope.copy = function(field){
		var newField = {},
			index = field.index;

		for(var i in field){
			if(field.hasOwnProperty(i)){
				newField[i] = angular.copy(field[i]);
			}
		}
	
		for(var i = field.index+1; i<$scope.fields.length;i++ ){
			$scope.fields[i].index += 1;
		}

		newField.id = guiid();
		delete newField.$$hashKey;
		$scope.fields = $scope.fields.slice(0, index).concat([newField]).concat($scope.fields.slice(index));
	}

	// Удаление поля
	$scope.remove = function(field){
		if(typeCount(field.type, $scope.fields) == 1 || !field.repeat){
			$scope.fields[field.index].disabled = !$scope.fields[field.index].disabled;
		}else{
			$scope.fields.splice(field.index, 1);
			setIndexes();
		}
	}

	// Автосохранение
	$scope.switchAutosave = function(){
		if($scope.settings.autosave){
			timer = $interval(function(){
				$scope.saveFile(true);
				console.log('Автосохранение');
			}, 60000);
		}else{
			$interval.cancel(timer);
		}
	}

	/* Inits */
	$scope.switchAutosave();
	pudra.api.http.get('fields')
}