pec.directives.preloader = function(){
  return function(){
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attr){
        var speed = parseInt(attr.speed || 100),
            $conj = $("." + attr['class']),
            $el = $(element),
            $timeout = pec.inject('$timeout');

        function response(){
          $timeout(function(){
            $conj.removeClass("notready");
            $el.fadeOut(speed);
          }, parseInt(attr.timeout) || 1000);
        }

        pec.api.listen('before:*',function(e){
          if(!e.sielent){
            $(element).fadeIn(100);
          }
        });

        pec.api.listen('after:*', response);

        if(attr.init == 'true'){
          $conj.addClass("notready");
          $(element).show();
        }else{
          $(element).hide();
        }

      },
      templateUrl: 'views/directives/preloader.tpl'
    }
  }
}
