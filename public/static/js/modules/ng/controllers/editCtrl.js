pec.controllers.editCtrl = function($scope){
  var $interval = pec.inject('$interval'),
      $http = pec.inject('$http'),
      timer;

  $scope.settings = {
    autosave : false
  }

  $scope.email = {

  }

  $scope.getDefault = function(field) {
    return field.options.filter(function(option){
      return option.isDefault
    })[0].value;
  }

  $scope.saveFile = function(sielent){
    pec.api.http.post('fields:save', {
      sielent: sielent,
      fields: $scope.fields
    });
  }

  $scope.loadFile = function(){
    pec.api.http.get('fields:load');
  }

  $scope.switchField = function(f){
    f.hidden = ! f.hidden;
  }

  $scope.sortListBy = function(order){
    $scope.fields.sort(function(a, b){
      return order.indexOf(a.id) > order.indexOf(b.id) ? 1 : -1;
    });

    setIndexes();

    console.log(_.map($scope.fields, function(e, i){
      return Warden.Utils.interpolate('Index : {{index}}, Name: {{name}}', e);
    }).join('\n'));

    $scope.$apply()
  }

  $scope.changeQuantity = function(field){
    field.quantity = !field.quantity;
    field.quantity = field.quantity ? 1 : 0;
    field.name = field.data[field.quantity ? 'plural' : 'singular'].name;
  }

  // Копирование поля
  $scope.copy = function(field){
    var newField = {},
      index = field.index;

    for(var i in field){
      if(field.hasOwnProperty(i)){
        newField[i] = angular.copy(field[i]);
      }
    }

    for(var i = field.index+1; i<$scope.fields.length;i++ ){
      $scope.fields[i].index += 1;
    }

    newField.id = guiid();
    delete newField.$$hashKey;
    $scope.fields = $scope.fields.slice(0, index).concat([newField]).concat($scope.fields.slice(index));
  }

  // Удаление поля
  $scope.remove = function(field){
    if(typeCount(field.type, $scope.fields) == 1 || !field.repeat){
      $scope.fields[field.index].disabled = !$scope.fields[field.index].disabled;
    }else{
      $scope.fields.splice(field.index, 1);
      setIndexes();
    }
  }

  // Автосохранение
  $scope.switchAutosave = function(){
    if($scope.settings.autosave){
      timer = $interval(function(){
        $scope.saveFile(true);
        console.log('Автосохранение');
      }, 60000);
    }else{
      $interval.cancel(timer);
    }
  }

  /* Inits */
  // $scope.switchAutosave();
}
