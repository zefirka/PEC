pec.controllers.mainCtrl = ['$scope', 'templates', function($scope, templates) {
	var $cookie = pec.inject("$cookieStore"),
			defTpl = $cookie.get('template');

	if(defTpl){
		$scope.templateIsChosen = true;
	}else{
		$scope.templateIsChosen = false;
	}

	templates
		.loadTemplates()
		.then(templates.getTemplates.bind($scope));

	$scope.createTemplateWrapper = function () {
		debugger;
		templates.createWrapper($scope.template);
	}

	$scope.chooseTpl = function (tpl, popup) {
		$scope.templateIsChosen = true;
		templates.chooseTemplate(tpl).then(function(response){
			$scope.blocks = response.blocks;
			$scope.template = tpl;
			$scope.templateUrl = "/files/" + $scope.template.name + "/wrapper.tpl";
			$cookie.put('template', tpl.name);
			pec.events.emit("template:ready", $scope.template);
			if(!popup){
				pec.events.emit('popup:close');
			}
		});
	}

	$scope.changeTemplate = function() {
		$scope.innerButtons = true;

		templates
			.loadTemplates(true)
			.then(templates.getTemplates.bind($scope))
			.then(function(){
				$scope.templateIsChosen = false;
				pec.events.emit('popup:open', {
					url: "jade/templates.tpl",
					onClose : function(){
						$scope.templateIsChosen = true;
					},
					onCancle : function(a, next){
						$scope.templateIsChosen = true;
						next();
					}
				});
			});
	}

	$scope.deleteTemplate = function() {
		$scope.innerButtons = true;
		pec.events.emit('popup:open', {
			url: 'jade/popups/warn.tpl',
			onSave : function(scope, next){
				templates.removeTemplate($scope.template).then(function(tpls){
					$scope.templateIsChosen = false;
					templates.getTemplates.bind($scope)(tpls);
				}).then(next);
			}
		})
	}

	$scope.editTemplate = function(isNew) {
		$scope.isNewTpl = isNew;
		$scope.innerButtons = false;

		pec.events.emit('popup:open', {
			url: 'jade/popups/edit.tpl',
			css: 'new-template',
		});
	}

	/* Editing template */
	$scope.message = "Добавить новую переменную";
	$scope.heading = "Переменные";
}];

/* Edit template controller */
pec.controllers.editTemplateCtrl = ['$scope', 'templates', function($scope, templates) {
	var isNew = $scope.isNewTpl == true;

	$scope.errors = [];

	$scope.tpl = {
		id : isNew ? parseInt($scope.templates.reduce(maxId).id) + 1 : parseInt($scope.template.id),
		name: isNew ? "" : $scope.template.name,
		templates: isNew ? "html" : ($scope.template.templates || "html"),
		variables: []
	}

	if(!isNew && $scope.template.variables && $scope.template.variables.length){
		$scope.tpl.variables = $scope.template.variables.map(JSON2Fields);
	}else{
		$scope.tpl.variables = [];
	}

	if(!isNew){
		var cachedName = $scope.template.name;
	}

	$scope.onSave = function(){
		$scope.tpl.modified = new Date().getTime();

		var errors = templates.validate($scope.tpl, $scope);

		if(!errors.length){
			if(isNew){
				templates
					.saveTemplate($scope.tpl)
					.then(templates.getTemplates.bind($scope))
					.then(function(){
						pec.events.emit('popup:close')
					})
			}else{
				templates
					.updateTemplate($scope.tpl, cachedName)
					.then(function(tpls){
						return templates.getTemplates.bind($scope)(tpls, $scope.tpl.name);
					})
					.then(function(){
						pec.events.emit('popup:close')
					})
			}
		}else{
			$scope.errors = errors;
		}
	}

	$scope.onCancle = function(){
		$scope.isNewTpl = false;
		pec.events.emit('popup:close');
	}

}];

pec.controllers.editCtrl = function($scope){
	var $interval = pec.inject('$interval'),
			$http = pec.inject('$http'),
			timer;

	$scope.settings = {
		autosave : false
	}

	$scope.email = {

	}

	$scope.getDefault = function(field) {
		return field.options.filter(function(option){
			return option.isDefault
		})[0].value;
	}

	$scope.saveFile = function(sielent){
		pec.api.http.post('fields:save', {
			sielent: sielent,
			fields: $scope.fields
		});
	}

	$scope.loadFile = function(){
		pec.api.http.get('fields:load');
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
	// $scope.switchAutosave();
}
