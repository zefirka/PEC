/**
  #pec-form

  Domain: NG.Directives.Directive
  Name: pecForm
  Description: {}
  Dependecies : []
  
*/

pec.directives.pecForm = function(){
  return function(){
    return {
      restrict: 'E',
      transclude: true,
      link: function(scope, element, attr){
        var $form = $(element);

        var id = 0,
            optid = 0;

        var $parse = pec.inject("$parse");

        scope.fields = $parse(attr.fields)(scope);

        scope.$watch("tpl", function(n,o){
          if(n){
            scope.fields = $parse(attr.fields)(scope).map(JSON2Fields);
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

        scope.chooseFile = function(){
          $form.find('input[type="file"]').click();
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
