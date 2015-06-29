pec.factories = {};

pec.factories.templates = function(){
  return function () {
		var model = {},
        nid;

    return {
      validate: function(tpl, scope){
        var errs = [];

        if(!/[A-Za-z][A-Za-z0-9]+/.test(tpl.name)){
          errs.push({
            field: "Название шаблона",
            message: "Недопустимое имя"
          });
        }

        var tplWithSameName = scope.templates.filter(function(t){ return t.name == tpl.name; })[0];
        if((tplWithSameName && scope.isNewTpl) || (tplWithSameName && tplWithSameName.id !== tpl.id)){
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
            template: tpl2json(tpl)
					}).then(function(response){
						return model = response.data || response;
					});
			},

      updateTemplate: function(tpl, name) {
        return pec.http.post('/api?', {
          action: 'update',
          domain: 'templates',
          template: tpl2json(tpl),
          name: name
        }).then(function(response){
          return model = response.data || response;
        })
      },

			saveTemplate: function(tpl) {
				return pec.http.post('/api?', {
					action: 'save',
					domain: 'templates',
          template : tpl2json(tpl)
				}).then(function(response){
          return model = response.data || response;
        });
			}
    };
  };
};
