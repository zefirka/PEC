// TODO Сделать красиво
pudra.functional.sizematch = (function(){
	var items = [],
			classmap = pudra.bootstrap.responsive.rangeClasses.map(function(e){
				return 'g-' + e;
			}).join(' '),
			$window = $(window);
	
	function react(e){
		var w = $window.width();
		items.forEach(function(item){
			item.removeClass(classmap).addClass('g-' + pudra.bootstrap.getRange(w))
		});
	}
	
	$window.resize(react)
	react();
	
	return {
		add : function(item){
			item.$$sizematchID = items.push(item);
			item.removeClass(classmap).addClass('g-' + pudra.bootstrap.getRange($window.width()));
		},
		remove : function(item){
			if(item.$$sizematchID){
				debugger;
			}
		}
	}
	
})();

pudra.inject = function(module) {
    return angular.element(document).injector().get(module);
}


pudra.api.cache = (function(){
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


/* HTTP */
Warden.extend(pudra.api);

pudra.api.gets = Warden.makeStream(function(emit){
	pudra.api.listen('get:after', function(data){
		emit(data);
	});
}).bus();

pudra.api.posts = Warden.makeStream(function(emit){
	pudra.api.listen('post:after', emit);
}).bus();

pudra.api.getsBefore = Warden.makeStream(function(emit){
	pudra.api.listen('get:before', emit);
}).bus();

pudra.api.postsBefore = Warden.makeStream(function(emit){
	pudra.api.listen('post:before', emit);
}).bus();

pudra.api.getType = function(type){
	return pudra.api.gets.filter(function(e){
		return e.useType == type;
	}).map('.data');
}

pudra.api.http = (function(){
	function response(type, response){
		pudra.api.emit(type + ':after', response);
	}

	function request(type){
		return function (use, data){
			pudra.api.emit(type + ':before', data);

			if(data && data.cache && pudra.api.cache.cached(use)){
				response(type, pudra.api.cache.get(use));
			}else{
				pudra.inject('$http')[type]( use.indexOf('search') >= 0 ? use : '/api?' + use, data).then(function(res){
					if(data && data.cache){
						pudra.api.cache(use, res)
					}
					res.useType = use;
					response(type, res);

				}, function(res){
					res.isError = true;
					res.useType = type;
					response(type, res);
				});
			}
		
			return pudra.api[type + 's'];
		}
	}


	return {
		get : request('get'),
		post: request('post')
	}
})();


_.mask = function(arr, prop){
	return _.map(arr, function(field){
			return field[prop];
	});
}