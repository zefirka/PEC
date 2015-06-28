pec.factories = {};

pec.factories.templates = function(){
  return function () {
		var model = {};

    return {
      validate: function(tpl, scope){
        var errs = [];

        if(!/[A-Za-z][A-Za-z0-9]+/.test(tpl.name)){
          errs.push({
            field: "Название шаблона",
            message: "Недопустимое имя"
          });
        }

        if(!scope.isNewTpl && scope.templates.some(function(t){ return t.name == tpl.name; })){
          errs.push({
            field: "Название шаблона",
            message: "Имя " + tpl.name + " уже знаято"
          });
        }

        return errs;
      },

			loadTemplates: function(sielent) {
				return pec.http.get('/api?', {
					action: 'load',
					domain: 'templates'
				}, sielent).then(function(response){
					return model = response.data || response
				});
			},

      getTemplates: function(templates, updated) {
        var defTpl = pec.inject("$cookieStore").get('template'),
            chosen = null,
            $scope = this;

        if(templates.length){
          $scope.templates = templates;

          if($scope.templateIsChosen){

            chosen = _.filter(templates, function(tpl){
              return tpl.name == (updated || defTpl);
            })[0];

            if(chosen){
              $scope.templateIsChosen = true;
              $scope.template = chosen;
              $scope.chooseTpl(chosen, true);
            }
            $scope.templateUrl = "/files/" + $scope.template.name + "/wrapper.tpl";
          }
        }

        return templates;
			},

			chooseTemplate: function(tpl){
				return pec.http.post('/api?', {
					action: 'choose',
					domain: 'templates',
					template: tpl
				}, true).then(function(response){
					return model = response.data || response;
				});
			},

			removeTemplate : function(tpl){
					return pec.http.post('/api?', {
						action: 'remove',
						domain: 'templates',
            template: tpl
					}).then(function(response){
						return model = response.data || response;
					});
			},

      updateTemplate: function(tpl, name) {
        return pec.http.post('/api?', {
          action: 'update',
          domain: 'templates',
          template: tpl,
          name: name
        }).then(function(response){
          return model = response.data || response;
        })
      },

			saveTemplate: function(tpl) {
				return pec.http.post('/api?', {
					action: 'save',
					domain: 'templates',
          template : tpl
				}).then(function(response){
          return model = response.data || response;
        });
			}
    };
  };
};
