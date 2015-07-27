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



pec.directives.pecTrigger = function(){
  return function(){
    return {
      scope: false,
      restrict: 'A',
      link: function(scope, element, attr){
        var sp = attr.pecTrigger.split(':');

        if(sp.length > 2){
          console.error("ERROR: pec-trigger value error. Allowed: pec-trigger=\"eventname:xpath\"");
        }

        var evt = sp[0],
            id = sp[1];

        $(element).on(evt, function(event){
          var elem = document.getElementById(id),
              newEvent = document.createEvent("MouseEvents");

          newEvent.initEvent(evt, true, false);
          elem.dispatchEvent(newEvent);
        });
      }
    }
  }
}

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

/*
 *  Directive: <pec-form>
 *  Restrict: Element
 *  Usage: {
 *    @block: templates/edit
 *    @position: main
 *  }
 */

//= include directives/pecForm.js

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
