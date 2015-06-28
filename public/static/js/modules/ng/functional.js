// TODO Сделать красиво
pec.functional.sizematch = (function(){
	var items = [],
			classmap = pec.bootstrap.responsive.rangeClasses.map(function(e){
				return 'g-' + e;
			}).join(' '),
			$window = $(window);

	function react(e){
		var w = $window.width();
		items.forEach(function(item){
			item.removeClass(classmap).addClass('g-' + pec.bootstrap.getRange(w))
		});
	}

	$window.resize(react)
	react();

	return {
		add : function(item){
			item.$$sizematchID = items.push(item);
			item.removeClass(classmap).addClass('g-' + pec.bootstrap.getRange($window.width()));
		},
		remove : function(item){
			if(item.$$sizematchID){
				debugger;
			}
		}
	}

})();

pec.inject = function(module) {
  return angular.element(document).injector().get(module);
}

pec.api.cache = (function(){
	var store = {};

	function cache(namespace, data){
		store[namespace] = data;
	}

	cache.cached = function(namespace){
		return _.is.exist(store[namespace]);
	}

	cache.get = function(namespace){
		return store[namespace];
	}

	return cache;
})();


Warden.extend(pec.api);

pec.http = {};

(['get', 'post']).forEach(function(method) {
	pec.http[method] = function(url, options, sielent) {

		pec.api.emit('before:' + method, {
			sielent : sielent,
			url: url,
			options: options
		});

		options.sielent = sielent;
		
		return pec
			.inject('$http')({
				method: method.toUpperCase(),
				url: url,
				params: options
			})
			.success(function(response) {
				pec.api.emit('success:' + method, response);
			})
			.error(function(response) {
				pec.api.emit('error:' + method, response);
			})
			.then(function(response) {
				pec.api.emit('after:' + method, response);
				return response;
			});
	}
});



_.mask = function(arr, prop){
	return _.map(arr, function(field){
			return field[prop];
	});
}
