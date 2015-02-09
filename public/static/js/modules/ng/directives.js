/* Thutaq Directives */

pudra.directives.ngpopup = function(){ 

	return function(){
		return {
			restrict: 'A',
			link: function(scope, element, attr){
				var $timeout = pudra.inject('$timeout'),
					popup = $(element);

				pudra.api.sielents = pudra.api.posts.filter(function(response){
					return !response.data.sielent
				})

				pudra.api.sielents.listen(function(response){
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
					
					var res = $(".builder")
						.html()
						.replace('class=""', '')
						.replace(/\<\!\-\- end ngRepeat\: \(index\, field\) in fields \-\-\>/g, '')
						.replace(/\<\!\-\- ngInclude\: field\.template \-\-\>/g, '')

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