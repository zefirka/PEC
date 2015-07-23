pec.controllers.mainCtrl = ['$scope', 'templates', function($scope, templates) {
  var $cookie = pec.inject("$cookieStore"),
      defTpl = $cookie.get('template');

  $scope.templateIsChosen = _.is.exist(defTpl) ? true : false;

  /* Loading all templates */
  if(pec.cache.get('templates')){
      templates.getTemplates.call($scope, pec.cache.get('templates'));
  }else{
    templates
      .loadTemplates()
      .then(templates.getTemplates.bind($scope))
      .then(function(){
        pec.cache('templates', $scope.templates);
      });
  }

  // $scope.createTemplateWrapper = function () {
  //   templates.createWrapper($scope.template);
  // }

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


    templates
      .loadTemplates(true)
      .then(templates.getTemplates.bind($scope))
      .then(function(){
        $scope.templateIsChosen = false;

        // pec.events.emit('popup:open', {
        //   url: "views/templates.tpl",
        //   onClose : function(){
        //     $scope.templateIsChosen = true;
        //   },
        //   onCancle : function(a, next){
        //     $scope.templateIsChosen = true;
        //     next();
        //   }
        // });
      });
  }

  $scope.deleteTemplate = function() {
    $scope.innerButtons = true;
    pec.events.emit('popup:open', {
      url: 'views/popups/warn.tpl',
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
      url: 'views/popups/edit.tpl',
      css: 'new-template',
      dependencies: ['wyswig.editor']
    });
  }

  /* Editing template */
  $scope.message = "Добавить новую переменную";
  $scope.heading = "Переменные";
}];
