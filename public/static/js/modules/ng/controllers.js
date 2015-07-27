var tplMock = {
	name: '',
	templates: '',
	variables : []
}



/* Index page ctrl */
//= include controllers/indexCtrl.js

/* Main dashboard controller */
//= include controllers/mainCtrl.js

/* Edit template controller */
//= include controllers/editTemplateCtrl.js

/* Edti constructor controller */
//= include controlles/editCtrl.js


/**
	#edit-template
	Domain: NG.Controllers.Controller {as <controller>}
	Name: editTemplate
	Description: template editing controller
	Dependecies: $scope, NG.Factories.Factory.templates
*/
pec.controllers.editTemplate = ['$scope', 'templates', function($scope, templates){
	var id = pec.inject('$routeParams').id;

	$scope.isNew = id ? false : true;
	$scope.tpl = tplMock;
	$scope.errors = [];


	templates.cache(function(result){
		$scope.templates = result
		$scope.tpl = id ? match($scope.templates, 'id', id) : tplMock;
	});

	$scope.save = function(){
		debugger;
	}


	$scope.toggleEditor = function(){
		debugger;
		$scope.innerButtons = true;
		pec.events.emit('popup:open', {
			url: 'views/popups/editor.tpl',
			onSave : function(scope, next){
				debugger;
			}
		})
	}

}];


pec.controllers.templatesList = ['$scope', 'templates', function($scope, templates){
	templates.cache(function(result){
		$scope.templates = result
	}, true);

	$scope.chooseTpl = function(tpl){
		debugger;
	}
}];
