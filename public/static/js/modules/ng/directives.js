//= include directives/ngPopup.js


pec.directives.pecBlocks = function () {
  return function () {
    return {
      restrict: 'E',
      transclude: true,
      link: function (scope, element, attr) {
        debugger;
      },
      templateUrl : 'views/directives/blocks.tpl'
    }
  }
}

//= include directives/compiller.js
//= include directives/preloader.js


pec.directives.swipeMenu = function(){
  return function(){
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attr){
        var $el = $(element),
            $ul = $el.find(".js-list"),
            $ico = $el.find(".js-rotate");

        function hide() {
          $ul.animate({
            "width":  0,
            "letter-spacing": -1
          }, 200);
          $ul.find('li').animate({
            padding: 0
          }, 200)
        }

        function show() {
          $ul.animate({
            "width":  "100%",
            "letter-spacing": 0
          }, 200);
          $ul.find('li').animate({
            padding: "10px 15px"
          }, 200)
        }



        scope.menu = {
          state : attr.swipeMenu == "false"
        }



        $ico.click(function(){
          scope.menu.state = !scope.menu.state;
          if(scope.menu.state){
            show()
          }else{
            hide()
          }
          scope.$apply();
        });

      }
    }
  }
}

pec.directives.pecForm = function(){
  return function(){
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attr){
        var id = 0,
            optid = 0;

        var $parse = pec.inject("$parse");


        scope.fields = $parse(attr.fields)(scope);
        scope.$watch("template", function(n,o){
          if(n){
              scope.fields = $parse(attr.fields)(scope);
          }
        });

        scope.newField = function(){
          this.addingNewField = true;
          this.newFieldType = "text";
        }

        scope.removeField = function (field) {
          scope.fields = scope.fields.filter(function (f) {
            return f.id !== field.id;
          })
        }

        scope.collapseAddition = function(){
          this.addingNewField = false;
          this.newFieldType = "text";
        }

        scope.addNewField = function () {
          this.fields.push({
            id : id++,
            type: this.newFieldType,
            options : []
          });
        }

        scope.addOption = function(field) {
          field.options.push({
            id: optid++,
            value: "",
            name: ""
          });
        }

        scope.removeOption = function (field, option) {
          debugger;
          field.options = field.options.filter(function(o){
            return o.id !== option.id;
          });
        }

      },
      templateUrl: 'views/directives/form.tpl'
    }
  }
}


pec.directives.ngForm = function(){
  return function(){
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attr){
        var $parse = pec.inject("$parse");

        pec.events.listen("template:ready", function(template){
          scope.vars = template.variables.map(JSON2Fields);
        });

      },
      templateUrl: 'views/directives/ngform.tpl'
    }
  }
}




pec.directives.list = function(){
  return function(){
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attr){
        var ul = $(element).find('#sortable');

        ul.sortable({
          update: function(event, ui){
            scope.sortListBy(_.map(ul.find('li'), function(li){
              return li.id;
            }));
          }
        })
      },
      templateUrl: 'views/list.tpl'
    }
  }
}

pec.directives.mainTable = function(){
  return function(){
    return {
      restrict: 'A',
      link: function(scope, element, attr){
        var table = $(element);

        scope.$watch('tablewidth', function(bw){
          bw = parseInt(bw);

          var cw   = table.width(),
              brw = table.find('.gen-demo').width();

          table.width(cw - brw + bw);
          table.find('.gen-demo').width(bw);
        })
      }
    }
  }
}


pec.directives.ngCollapsible = function(){
  return function(){
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attr){
        var $el = $(element),
            $ico = $el.find('.js-ico'),
            $pane = $el.find('.js-pane');

        $ico.click(function() {
          $pane.slideToggle();
          $ico.toggleClass("__up__");
        });

      }
    }
  }
}

pec.directives.sizematch = function(){
  return function(){
    return {
      restrict: 'A',
      transclude: false,
      link: function(scope, element, attr){
        function match(){
          pec.bootstrap.responsive.rangeClasses.forEach(function(className){
            element.removeClass('g-' + className);
          });

          element.addClass('g-' + pec.bootstrap.getRange(pec.consts.$window.width()));
        }

        pec.consts.$window.resize(match);
        match();
      }
    }
  }
}

//= include directives/item.js
//= include directives/upload.js
