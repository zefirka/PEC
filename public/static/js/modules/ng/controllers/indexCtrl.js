pec.controllers.indexCtrl = ['templates', '$scope',  function(templates, $scope){
	if(!pec.cache.get('templatesLoaded')){
		pec.inject('$timeout')(function(){
			templates.loadTemplates(true).then(function(tpls){
				pec.cache('templates', tpls);
				pec.cache('templatesLoaded', true);
			});
		}, 1000);
	}
	$scope.test = "ALLHU AKBAR"
}];
