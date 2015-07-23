pec.directives.compiller = function(){
  return function(){
    return {
      restrict: 'A',
      link: function(scope, element, attr){
        var $compile = pec.inject('$compile');

        pec.events.listen('email:change', function(e){
          debugger;
          $compile(element)(scope)
        })

        scope.compile = function(){
          $(".builder").append($(element).html());
          var ft = $(".builder").children();

          $(".remove-childs", ft).remove();

          function sanitize(area){
            while(area.find(".to-remove").length){

              $(".to-remove", area).each(function(){
                var item = $(this);

                if(!item.find('.to-remove').length){
                  item.before(item.html());
                  item.remove();
                }else{
                  sanitize(item);
                }

              });

              sanitize(ft);
            }
          }

          sanitize(ft);
          $(".ng-scope", ft).removeClass("ng-scope");

          $("[ng-src]", $(".builder")).each(function(){
            $(this).removeAttr("ng-src");
          });

          var res = $(".builder")
            .html()
            .replace(/class\=\"\"/g, '')
            .replace(/class\=\"ng-binding\"/g, '')
            .replace(/\<\!\-\- end ngRepeat\: \(index\, field\) in fields \-\-\>/g, '')
            .replace(/\<\!\-\- ngInclude\: field\.template \-\-\>/g, '')
            .replace(/<!--(.*?)-->/g, '')

          pec.api.sielents.fire({
            resulting: res,
            data : { sielent: false },
            message: 'На, полуйча браток, братишка'
          })

        }
      }
    }
  }
}
