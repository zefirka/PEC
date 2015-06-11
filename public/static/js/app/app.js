var _ = Warden.Utils;


var pudra = {
	static : 'public/static/jade/',
	bootstrap : Bootstrap,
	routes: {},
	functional : {},
	api : {},
	
	controllers : {},
	directives : {},
	filters : {}
	
}

/* Function returns controller */
pudra.getController = function(route){
	var c = pudra.controllers[route.controller] || pudra.controllers[route.name] || pudra.controllers[route.route]; 
	return typeof route.controller == 'function' ? route.command : c; 
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

function mapIndex(data){
	return _.map(data, function(field, i){
		field.hidden = true;
		field.index = i;
		return field;			
	});
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
		return e.type == type;
	});
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
					response(type, res.data);

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

pudra.controllers.mainCtrl = function($scope){
	var $interval = pudra.inject('$interval'),
		getFields = pudra.api.getType('load').map('.data'),
		timer;

	var setIndexes = function(){
		$scope.fields = $scope.fields.map(function(field, index){
			field.index = index;
			return field;
		});
	}
		
	$scope.tablewidth = 960;
	$scope.phonenum = "8-800-775-1060";
	$scope.pattern = "http://pudra.ru/skins/pudra/mail/email_letter/img/textures/background.png";
	$scope.settings = {
		height: "390px",
		autosave : false
	}

	getFields.map(mapIndex).watch().bindTo($scope, 'fields');	

	$scope.saveFile = function(sielent){
		pudra.api.http.post('fields:save', {
			sielent: sielent,
			fields: $scope.fields
		});
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
	$scope.switchAutosave();
	pudra.api.http.get('fields')
}

/* Thutaq Directives */

pudra.directives.ngpopup = function(){ 
	function by(prop, val){
		return function(e){
			return e[prop] == val;
		}
	}
	return function(){
		return {
			restrict: 'A',
			link: function(scope, element, attr){
				var $timeout = pudra.inject('$timeout'),
					popup = $(element);

				$(document).bind('keydown', function(e) {
					if(e.ctrlKey && (e.which == 83)) {
						e.preventDefault();
				    	scope.saveFile();
						return false;
					}
				});

				pudra.api.sielents = pudra.api.posts.filter(function(response){
					return !response.sielent
				})

				pudra.api.sielents.listen(function(response){
					scope.resulting = response.resulting || false;
					$("body main").addClass("distant");                   
					$timeout(function(){
  						popup.show();
  						popup.addClass("open");  
  						scope.message = response.message;
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

					pudra.api.sielents.fire({
						resulting: res,
						data : { sielent: false },
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
						if(!e.sielent){
							$(element).fadeIn(100);
						}
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

pudra.filters.link = function(){
	return function(){
        return function(link){
            if(/(http|https)\:\/\/[^\/"]/.test(link)){
            	return link
            }else{
            	return "http://" + (link.length ? link : "pudra.ru");
            }
        }
    }
}
