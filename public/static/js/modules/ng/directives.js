pec.directives.ngpopup = function(){
	function by(prop, val){
		return function(e){
			return e[prop] == val;
		}
	}
	return function(){
		return {
			restrict: 'E',
			transclude: true,

			link: function(scope, element, attr){
				var $timeout = pec.inject('$timeout'),
						popup = $(element).find('.ng-popup'),
						onSave,
						onClose,
						css = null,
						onCancle,
						state = false;

				function close() {
					debugger;
					state = false;
					$("body .wrapper").removeClass("distant");
					popup.removeClass("open");
					$timeout(function(){
							popup.hide();
							onClose && onClose(scope);
							scope.contentUrl = "";
							popup.find('.i-area').children().remove();
							element.removeClass(css);
					}, 100);
				}

				scope.contentUrl = "";

				scope.open = function(data, url){
					state = true;
					$("body .wrapper").addClass("distant");
					scope.contentUrl = url;

					$timeout(function(){
  						popup.show();
  						popup.addClass("open");
							scope.data = data;
					}, 100);
				};

				scope.onSave = function () {
					return onSave ? onSave(scope, close) : close();
				}

				scope.onCancle = function(){
					return onCancle ? onCancle(scope, close) : close();
				}

				pec.events.listen("popup:open", function(data){
					scope.open(data.data, data.url);
					onCancle = data.onCancle && data.onCancle;
					onSave = data.onSave && data.onSave;
					onClose = data.onClose && data.onClose;

					if(data.css){
						css = data.css;
						element.addClass(css);
					}
				});

				pec.events.listen("popup:close", close);

				pec.events.listen("popup:toggle", function(data){
					if(state){
						close()
					}else{
						scope.open(data.data, data.url);
					}
				});

			},
			templateUrl: 'jade/directives/popup.tpl'
		}
	}
}

pec.directives.letter = function(){
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

					pec.api.sielents.fire({
						resulting: res,
						data : { sielent: false },
						message: 'На, полуйча браток, братишка'
					})

				}
			}
		}
	}
}

pec.directives.preloader = function(){
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

				var $timeout = pec.inject('$timeout');

				if(attr.init){
					pec.api.listen('before:*',function(e){
						if(!e.sielent){
							$(element).fadeIn(100);
						}
					});
				}

				if(attr.autoresponse){
					response()
				}else{
					pec.api.listen('after:*', response);
				}
			},
			templateUrl: 'jade/directives/preloader.tpl'
		}
	}
}


pec.directives.pecForm = function(){
	return function(){
		return {
			restrict: 'E',
			transclude: true,
			link: function(scope, element, attr){
				var id = 0,
						optid = 0;

				var $parse = pec.inject("$parse");
				scope.fields = $parse(attr.fields)(scope)

				scope.$watch("template", function(n,o){
					if(n){
							scope.fields = $parse(attr.fields)(scope).map(JSON2Fields)
					}
				});

				scope.newField = function(){
					this.addingNewField = true;
					this.newFieldType = "text";
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
			templateUrl: 'jade/directives/form.tpl'
		}
	}
}


pec.directives.ngForm = function(){
	return function(){
		return {
			restrict: 'E',
			transclude: true,
			link: function(scope, element, attr){
				var $parse = pec.inject("$parse");
				scope.fields = $parse(attr.fields)(scope)

				scope.$watch("template", function(n,o){
					if(n){
							scope.fields = $parse(attr.fields)(scope).map(JSON2Fields)
					}
				});
			},
			templateUrl: 'jade/directives/ngform.tpl'
		}
	}
}




pec.directives.list = function(){
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

pec.directives.mainTable = function(){
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

pec.directives.etemplate = function () {
	return function () {
		return {
			restrict: 'E',
			transclude: true,
			link: function (scope, element, attr) {

			},
			templateUrl: 'jade/table.tpl'
		}
	}
}

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

pec.directives.sizematch = function(){
	return function(){
		return {
			restrict: 'A',
			link: function(scope, element, attr){
				pec.functional.sizematch.add($(element));;

			}
		}
	}
}

pec.directives.newTpl = function() {
  return function(){
		return {
	    restrict: 'A',
	    link: function(scope, elem, attr) {
				var isNew = attr.newTpl == "true";

				scope.tpl = {
					name: isNew ? "" : scope.template.name,
					templates : isNew ? "html"  : scope.template.templates,
					variables : []
				};
			}
    }
  };
};
