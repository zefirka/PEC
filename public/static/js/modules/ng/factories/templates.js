/**
  Domain: NG.Factories.Factory
  Name: templates
  Description: service provides API to work with templates
*/

pec.factories.templates = function(){
  var API = "/templates?";

  return function() {
    var Validator = pec.inject('validator');
    var model = {};


    function saveModel(response){
      return model = response.data || response;
    }

    return {
      /***
        Domain: NG.Factories.Factory.Method
        Name: validate
        Description: validates template
        Signature: {object} -> {array}
      */
      validate: function(data){
        return Validator.template(data);
      },

      /**
        Domain: Factory.Method
        Name: loadTemplates
        Description: loads templates from server
        Signature: {boolean : sielent} -> {promise}

        Usage: {
          sielent : if [true] then request will not trigger [ajax loading-box](#ajax-loading-box)
        }
      */
      loadTemplates: function(sielent) {
        return pec.http.post(API, {
          params: {
            action: 'load'
          },
          sielent: sielent
        }).then(saveModel);
      },

      /**
        #templates.cache

        Domain: Factory.Method
        name: cache
        Description: caches templates or return cached if they have been already cached.
        Signature: {function : fn, boolean : preloading }  -> {array}

        Usage: {
          fn : callback which will be called when method will recieve templates,
          preloading : if [true] then request will trigger [ajax loading-box](#ajax-loading-box)
        }
      */
      cache : function(fn, preloading){
        var self = this,
            $timeout = pec.inject('$timeout'),
            templates = pec.cache.get('templatesLoaded') ? pec.cache.get('templates') : false;

        if(!templates){

          if(preloading){
              pec.api.emit('before:load');
          }

          $timeout(function(){
            self.loadTemplates(true).then(function(tpls){
              pec.cache('templates', tpls);
              pec.cache('templatesLoaded', true);
              fn && fn(tpls);
            });

          }, 1000);
        }else{
          fn && fn(templates);
        }

        return templates;
      },


      /**
        #templates.getTemplates

        Domain: NG.Factories.Factory.Method
        name: getTemplates
        Description: binds templates to the scope
        Signature: {array : templates, boolean : updated }  -> {array : templates
      */
      getTemplates: function(templates, updated) {
        var defTpl = pec.inject("$cookieStore").get('template'),
            chosen = null,
            $scope = this;

        if(templates.length){
          $scope.templates = templates;

          if($scope.templateIsChosen){

            chosen = match(templates, 'name', updated || defTpl);

            if(chosen){
              $scope.templateIsChosen = true;
              $scope.template = chosen;
              $scope.chooseTpl && $scope.chooseTpl(chosen, true);
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
