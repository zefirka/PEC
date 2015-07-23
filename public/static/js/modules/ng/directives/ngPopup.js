pec.directives.ngpopup = function(){
  function by(prop, val){
    return function(e){
      return e[prop] == val;
    }
  }

  return function(){
    return {
      restrict: 'E',
      transclude: true,

      link: function(scope, element, attr){
        var $timeout = pec.inject('$timeout'),
            popup = $(element).find('.ng-popup'),
            onSave,
            onClose,
            css = null,
            onCancle,
            state = false;

        function close() {
          state = false;
          $("body .g-wrapper").removeClass("distant");
          popup.removeClass("open");
          $timeout(function(){
              popup.hide();
              onClose && onClose(scope);
              scope.contentUrl = "";
              popup.find('.i-area').children().remove();
              element.removeClass(css);
          }, 100);
        }

        scope.contentUrl = "";

        scope.open = function(data, url){
          state = true;
          // $("body .g-wrapper").addClass("distant");
          scope.contentUrl = url;

          $timeout(function(){
              popup.show();
              popup.addClass("open");
              scope.data = data;
          }, 100);
        };

        scope.onSave = function () {
          return onSave ? onSave(scope, close) : close();
        }

        scope.onCancle = function(){
          return onCancle ? onCancle(scope, close) : close();
        }

        pec.events.listen("popup:open", function(data){
          scope.open(data.data, data.url);
          onCancle = data.onCancle && data.onCancle;
          onSave = data.onSave && data.onSave;
          onClose = data.onClose && data.onClose;

          if(data.css){
            css = data.css;
            element.addClass(css);
          }
        });

        pec.events.listen("popup:close", close);

        pec.events.listen("popup:toggle", function(data){
          if(state){
            close()
          }else{
            scope.open(data.data, data.url);
          }
        });


      },
      templateUrl: 'views/directives/popup.tpl'
    }
  }
}
