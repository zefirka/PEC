pec.controllers.editTemplateCtrl = ['$scope', 'templates', function($scope,  templates) {
  var isNew = $scope.isNewTpl == true;

  $scope.errors = [];

  $scope.tpl = {
    id : isNew ? parseInt($scope.templates.reduce(maxId).id) + 1 : parseInt($scope.template.id),
    name: isNew ? "" : $scope.template.name,
    templates: isNew ? "html" : ($scope.template.templates || "html"),
    variables: [],
		wrapper: null,
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
				debugger;
        templates
          .saveTemplate($scope.tpl)
          .then(templates.getTemplates.bind($scope))
          .then(function(){
            pec.events.emit('popup:close')
          })
      }else{
        templates
          .updateTemplate($scope, cachedName)
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
