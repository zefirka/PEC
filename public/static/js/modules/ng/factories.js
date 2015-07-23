pec.factories = {};

pec.factories.templates = function(){
  var API = "/templates?";

  return function () {
    var model = {},
        nid;

    function saveModel(response){
      return model = response.data || response;
    }

    function validate(tpl, scope){
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
    }


    return {
      validate: validate,

      loadTemplates: function(sielent) {
        return pec.http.post(API, {
          params: {
            action: 'load'
          },
          sielent: sielent
        }).then(saveModel);
      },

      // createWrapper: function (tpl) {
      //   return pec.http.post("/api?", {
      //     action: 'createTemplateWrapper',
      //     domain: 'templates',
      //     template: tpl
      //   }).then(function (e) {
      //     debugger;
      //     pec.events.emit('email:change', e);
      //   })
      // },

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
        return pec.http.post(API, {
          params: {
            action: 'choose',
            template: tpl },
          sielent : true
        }).then(saveModel);
      },

      removeTemplate : function(tpl){
          return pec.http.post(API, {
            data: {
              action: 'remove',
              domain: 'templates',
              template: tpl2json(tpl) },
            sielent: false
          }).then(saveModel);
      },

      updateTemplate: function(tpl, name) {
        return pec.http.post(API, {
          data: {
            action: 'update',
            domain: 'templates',
            template: tpl2json(tpl),
            name: name },
          transformRequest: pec.transforms.file,
          headers: {
            'Content-Type': void 0
          },
          sielent: false
        }).then(saveModel)
      },

      saveTemplate: function(tpl) {
        return pec.http.post(API, {
          data: {
            action: 'save',
            domain: 'templates',
            template : tpl2json(tpl) },
          transformRequest: pec.transforms.file,
          headers: {
            'Content-Type': undefined
          },
          sielent : false
        }).then(saveModel);
      }
    };
  };
};
