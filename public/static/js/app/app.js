var _ = Warden.Utils;


var pudra = {
	static : 'public/static/jade/',
	bootstrap : Bootstrap,
	routes: {},
	functional : {},
	api : {},
	
	controllers : {},
	directives : {}
	
}

/* Function returns controller */
pudra.getController = function(route){
	var c = pudra.controllers[route.controller] || pudra.controllers[route.name] || pudra.controllers[route.route]; 
	return typeof route.controller == 'function' ? route.command : c; 
}
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
		emit(data.data);
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

pudra.api.http = (function(){
	function response(type, response){
		pudra.api.emit(type + ':after', response);
	}

	function request(type){
		return function (use, data){
			pudra.api.emit(type + ':before');

			if(data && data.cache && pudra.api.cache.cached(use)){
				response(type, pudra.api.cache.get(use));
			}else{
				pudra.inject('$http')[type]('/api?' + use, data).then(function(res){
					if(data && data.cache){
						pudra.api.cache(use, res)
					}
					response(type, res);

				}, function(res){
					res.isError = true;
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

function guiid(){
	return [1,2,3].map(function(){ return (Math.random()*1000)>>0}).join('-');
}

function typeCount(type, arr){
	return _.filter(arr, function(f){
		return f.type == type;
	}).length
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

function clean(obj, val){
	for(var i in obj){
		if(_.is.obj(obj[i])){
			obj[i] = clean(obj[i], val);
		}else{
			obj[i] = val || '';
		}
	}
	return obj;
}

function map(data){
	return _.map(data, function(field, i){
		field.hidden = true;
		field.index = i;
		return field;			
	});
}

pudra.controllers.mainCtrl = function($scope){
	$scope.tablewidth = 480;
	$scope.phonenum = "8-800-775-1060";
	$scope.pattern = "http://pudra.ru/skins/pudra/mail/email_letter/img/textures/background.png";

	$scope.settings = {
		height: "390px",
	}

	pudra.api.http.get('fields').map(map).watch().bindTo($scope, 'fields');
	

	$scope.saveFile = function(){
		pudra.api.http.post('fields:save', {fields: $scope.fields});
	}

	$scope.loadFile = function(){
		pudra.api.http.get('fields:load');
	}

	$scope.switchField = function(f){
		f.hidden = ! f.hidden;
	}

	$scope.sortListBy = function(order){
		$scope.fields.sort(function(a, b){
			return order.indexOf(a.id) > order.indexOf(b.id) ? 1 : -1;
		});

		$scope.fields = _.map($scope.fields, function(e, i){
			e.index = i;
			return e;
		});

		console.log(_.map($scope.fields, function(e, i){
			return {
				'index' : e.index,
				'name' : e.name
			}
		}))
	}

	$scope.changeQuantity = function(field){
		field.quantity = !field.quantity;
		field.quantity = field.quantity ? 1 : 0;
		field.name = field.data[field.quantity ? 'plural' : 'singular'].name;
	}

	$scope.copy = function(field){
		var newField = {},
			index = field.index;

		for(var i in field){
			if(field.hasOwnProperty(i)){
				newField[i] = clone(field[i]);
			}
		}
		
		
		for(var i = field.index+1; i<$scope.fields.length;i++ ){
			$scope.fields[i].index += 1;
		}

		newField.id = guiid();
		delete newField.$$hashKey;
		$scope.fields = $scope.fields.slice(0, index).concat([newField]).concat($scope.fields.slice(index))


	}

	$scope.remove = function(field){
		if(typeCount(field.type, $scope.fields) == 1){
			$scope.fields[field.index].disabled = !$scope.fields[field.index].disabled;
		}else{
			$scope.fields.splice(field.index, 1);
			for(var i = field.index+1; i<$scope.fields.length;i++ ){
				$scope.fields[i].index -= 1;
			}			
		}
	}

}

/* Thutaq Directives */

pudra.directives.ngpopup = function(){ 

	return function(){
		return {
			restrict: 'A',
			link: function(scope, element, attr){
				var $timeout = pudra.inject('$timeout'),
					popup = $(element);

				pudra.api.posts.listen(function(response){
					scope.resulting = response.resulting || false;
					$("body main").addClass("distant");                   
					$timeout(function(){
  						popup.show();
  						popup.addClass("open");  
  						scope.message = response.data.message;
					}, 100);
				});

				scope.collapse = function(){
					$("body main").removeClass("distant");
				    popup.removeClass("open");  
				    $timeout(function(){
				        popup.hide();    
				    }, 100);
				}				
			}
		}
	}
}

pudra.directives.letter = function(){ 
	return function(){
		return {
			restrict: 'A',
			link: function(scope, element, attr){
				scope.compile = function(){
					$(".builder").append($(element).html());
					var ft = $(".builder").children();
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
					
					var res = ft
						.html()
						.replace('class=""', '')
						.replace(/\<\!\-\- end ngRepeat\: \(index\, field\) in fields \-\-\>/g, '')
						.replace(/\<\!\-\- ngInclude\: field\.template \-\-\>/g, '')

					pudra.api.posts.fire({
						resulting: res,
						message: 'На, полуйча браток, братишка'
					})

				}
			}
		}
	}
}

pudra.directives.preloader = function(){
	return function(){
		return {
			restrict: 'E',
			transclude: true,
			link: function(scope, element, attr){
				var speed = parseInt(attr.speed || 100);
				scope.css = attr['class'];

				function response(){
					$timeout(function(){
						$(".notready").removeClass("notready");
						$(element).fadeOut(speed);
					}, parseInt(attr.timeout) || 1000);
				}

				var $timeout = pudra.inject('$timeout');
				
				if(attr.init){
					pudra.api.getsBefore.listen(function(e){
						$(element).fadeIn(100);
					});
				}

				if(attr.autoresponse){
					response()
				}else{
					pudra.api.gets.listen(response);
				}
			},
			templateUrl: 'jade/directives/preloader.tpl'
		}
	}
}

pudra.directives.list = function(){
	return function(){
		return {
			restrict: 'E',
			transclude: true,
			link: function(scope, element, attr){
				var ul = $(element).find('#sortable');

				ul.sortable({
					update: function(event, ui){
						scope.sortListBy(_.map(ul.find('li'), function(li){
							return li.id;
						}));
					}
				})
			},
			templateUrl: 'jade/list.tpl'
		}
	}
}

pudra.directives.mainTable = function(){
	return function(){
		return {
			restrict: 'A',
			link: function(scope, element, attr){
				var table = $(element);

				scope.$watch('tablewidth', function(bw){
					bw = parseInt(bw);
					
					var cw = table.width(),					
						brw =table.find('.gen-demo').width();

					table.width(cw - brw + bw);
					table.find('.gen-demo').width(bw);
				})
			}
		}
	}
}

pudra.directives.item = function(){
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

pudra.directives.sizematch = function(){
	return function(){
		return {
			restrict: 'A',
			link: function(scope, element, attr){
				pudra.functional.sizematch.add($(element));;
			}
		}
	}
}
