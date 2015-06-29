pec.directives.item = function(){
	return function(){
		return {
			restrict: 'E',
			transclude: true,
			link: function(scope, element, attr){
			},
			templateUrl: 'jade/item.tpl'
		}
	}
}
