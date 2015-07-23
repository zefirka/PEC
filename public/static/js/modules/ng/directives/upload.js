pec.directives.pecUpload = function(){
	return function(){
    return {
      restrict: 'A',
      scope: true,     //create a new scope
      link: function (scope, el, attrs) {
        el.bind('change', function (event) {
            var files = event.target.files;

            //iterate files since 'multiple' may be specified on the element
            _.each(files, function(file){
                //emit event upward
                scope.$emit("setWrapper", { file: file });
            });

        });
      }
    }
  }
}
