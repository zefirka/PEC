(function(root) {

	var _ = Warden.Utils;
	var pec = {
		static : 'public/static/jade/',
		bootstrap : Bootstrap,
		routes: {},
		functional : {},
		api : {},
		events: Warden({}),
		controllers : {},
		directives : {},
		filters : {}

	}

	/* Function returns controller */
	pec.getController = function(route){
		var c = pec.controllers[route.controller] || pec.controllers[route.name] || pec.controllers[route.route];
		return typeof route.controller == 'function' ? route.command : c;
	}
	pec.routes = {
		home : {
			route : ['/', '', 'home'],
			tpl : 'pages/dashboard.tpl'
		},
	
		about: {
			route: ["/about", "about"],
			tpl: 'pages/about.tpl'
		},
	
		'404' : {
				controller : 'notFoundCtrl',
				route : ['/404', '404'],
				tpl : 'pages/404.tpl',
		}
	}
	

	function guiid(){
		return [0,0,0,0].map(function(){ return (Math.random()*1000)>>0}).join('-');
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
	
	function JSON2Fields(field){
		var res = {};
	
		field = angular.copy(field);
	
		for(var name in field){
				if(name != "$$hashKey"){
					res.name = name;
				}
		}
	
		field = field[res.name];
	
		res.type = field.type;
	
		if(field.options){
			res.options = field.options;
		}
	
		delete field.options;
		delete field.type;
	
		for(var option in field){
			res[option] = field[option];
		}
	
		return res
	}
	
	function tpl2json(tpl) {
		var t = angular.copy(tpl);
		t.variables = t.variables.map(function (field) {
			var res = {},
					name = field.name
	
			res[name] = {};
	
			field = angular.copy(field);
	
			delete field.$$hashKey;
			delete field.name;
	
			for(var o in field){
				res[name][o] = field[o];
			}
	
			return res;
	
		});
		return t;
	}
	
	function maxId(a,b) {
			return parseInt(a.id) > parseInt(b.id) ? a : b;
	}
	

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
	

	pec.controllers.mainCtrl = ['$scope', 'templates', function($scope, templates) {
		var $cookie = pec.inject("$cookieStore"),
				defTpl = $cookie.get('template');
	
		if(defTpl){
			$scope.templateIsChosen = true;
		}else{
			$scope.templateIsChosen = false;
		}
	
		templates
			.loadTemplates()
			.then(templates.getTemplates.bind($scope));
	
		$scope.createTemplateWrapper = function () {
			debugger;
			templates.createWrapper($scope.template);
		}
	
		$scope.chooseTpl = function (tpl, popup) {
			$scope.templateIsChosen = true;
			templates.chooseTemplate(tpl).then(function(response){
				$scope.blocks = response.blocks;
				$scope.template = tpl;
				$scope.templateUrl = "/files/" + $scope.template.name + "/wrapper.tpl";
				$cookie.put('template', tpl.name);
				pec.events.emit("template:ready", $scope.template);
				if(!popup){
					pec.events.emit('popup:close');
				}
			});
		}
	
		$scope.changeTemplate = function() {
			$scope.innerButtons = true;
	
			templates
				.loadTemplates(true)
				.then(templates.getTemplates.bind($scope))
				.then(function(){
					$scope.templateIsChosen = false;
					pec.events.emit('popup:open', {
						url: "jade/templates.tpl",
						onClose : function(){
							$scope.templateIsChosen = true;
						},
						onCancle : function(a, next){
							$scope.templateIsChosen = true;
							next();
						}
					});
				});
		}
	
		$scope.deleteTemplate = function() {
			$scope.innerButtons = true;
			pec.events.emit('popup:open', {
				url: 'jade/popups/warn.tpl',
				onSave : function(scope, next){
					templates.removeTemplate($scope.template).then(function(tpls){
						$scope.templateIsChosen = false;
						templates.getTemplates.bind($scope)(tpls);
					}).then(next);
				}
			})
		}
	
		$scope.editTemplate = function(isNew) {
			$scope.isNewTpl = isNew;
			$scope.innerButtons = false;
	
			pec.events.emit('popup:open', {
				url: 'jade/popups/edit.tpl',
				css: 'new-template',
			});
		}
	
		/* Editing template */
		$scope.message = "Добавить новую переменную";
		$scope.heading = "Переменные";
	}];
	
	/* Edit template controller */
	pec.controllers.editTemplateCtrl = ['$scope', 'templates', function($scope, templates) {
		var isNew = $scope.isNewTpl == true;
	
		$scope.errors = [];
	
		$scope.tpl = {
			id : isNew ? parseInt($scope.templates.reduce(maxId).id) + 1 : parseInt($scope.template.id),
			name: isNew ? "" : $scope.template.name,
			templates: isNew ? "html" : ($scope.template.templates || "html"),
			variables: []
		}
	
		if(!isNew && $scope.template.variables && $scope.template.variables.length){
			$scope.tpl.variables = $scope.template.variables.map(JSON2Fields);
		}else{
			$scope.tpl.variables = [];
		}
	
		if(!isNew){
			var cachedName = $scope.template.name;
		}
	
		$scope.onSave = function(){
			$scope.tpl.modified = new Date().getTime();
	
			var errors = templates.validate($scope.tpl, $scope);
	
			if(!errors.length){
				if(isNew){
					templates
						.saveTemplate($scope.tpl)
						.then(templates.getTemplates.bind($scope))
						.then(function(){
							pec.events.emit('popup:close')
						})
				}else{
					templates
						.updateTemplate($scope.tpl, cachedName)
						.then(function(tpls){
							return templates.getTemplates.bind($scope)(tpls, $scope.tpl.name);
						})
						.then(function(){
							pec.events.emit('popup:close')
						})
				}
			}else{
				$scope.errors = errors;
			}
		}
	
		$scope.onCancle = function(){
			$scope.isNewTpl = false;
			pec.events.emit('popup:close');
		}
	
	}];
	
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
						state = false;
						$("body .g-wrapper").removeClass("distant");
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
						$("body .g-wrapper").addClass("distant");
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
	
	
	pec.directives.pecBlocks = function () {
		return function () {
			return {
				restrict: 'E',
				transclude: true,
				link: function (scope, element, attr) {
					debugger;
				},
				templateUrl : 'jade/directives/blocks.tpl'
			}
		}
	}
	
	pec.directives.letter = function(){
		return function(){
			return {
				restrict: 'A',
				link: function(scope, element, attr){
					var $compile = pec.inject('$compile');
	
					pec.events.listen('email:change', function(e){
						debugger;
						$compile(element)(scope)
					})
	
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
	
	pec.directives.swipeMenu = function(){
		return function(){
			return {
				restrict: 'A',
				transclude: false,
				link: function(scope, element, attr){
					var $el = $(element),
							$ul = $el.find(".js-list"),
							$ico = $el.find(".js-rotate");
	
					function hide() {
						$ul.animate({
							"width":  0,
							"letter-spacing": -1
						}, 200);
						$ul.find('li').animate({
							padding: 0
						}, 200)
					}
	
					function show() {
						$ul.animate({
							"width":  "100%",
							"letter-spacing": 0
						}, 200);
						$ul.find('li').animate({
							padding: "10px 15px"
						}, 200)
					}
	
	
	
					scope.menu = {
						state : attr.swipeMenu == "false"
					}
	
	
	
					$ico.click(function(){
						scope.menu.state = !scope.menu.state;
						if(scope.menu.state){
							show()
						}else{
							hide()
						}
						scope.$apply();
					});
	
				}
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
					debugger;
					scope.fields = $parse(attr.fields)(scope)
	
					scope.$watch("template", function(n,o){
						if(n){
								scope.fields = $parse(attr.fields)(scope);
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
	
					pec.events.listen("template:ready", function(template){
						scope.vars = template.variables.map(JSON2Fields);
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
	
						var cw 	= table.width(),
								brw = table.find('.gen-demo').width();
	
						table.width(cw - brw + bw);
						table.find('.gen-demo').width(bw);
					})
				}
			}
		}
	}
	
	
	pec.directives.ngCollapsible = function(){
		return function(){
			return {
				restrict: 'A',
				transclude: false,
				link: function(scope, element, attr){
					var $el = $(element),
							$ico = $el.find('.js-ico'),
							$pane = $el.find('.js-pane');
	
					$ico.click(function() {
						$pane.slideToggle();
						$ico.toggleClass("__up__");
					});
	
				}
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
	
	
	

	pec.filters.link = function(){
		return function(){
	        return function(link){
	            if(/(http|https)\:\/\/[^\/"]/.test(link)){
	            	return link
	            }else{
	            	return "http://" + (link.length ? link : "pec.ru");
	            }
	        }
	    }
	}
	
	pec.filters.JSON2Fields = function(){
		return function(){
	        return function(json){
	            if(!json){
								return [];
							}else{
								return json.map(JSON2Fields)
							}
	        }
	    }
	}
	

	pec.factories = {};
	
	pec.factories.templates = function(){
	  return function () {
			var model = {},
	        nid;
	
	    return {
	      validate: function(tpl, scope){
	        var errs = [];
	
	        if(!/[A-Za-z][A-Za-z0-9]+/.test(tpl.name)){
	          errs.push({
	            field: "Название шаблона",
	            message: "Недопустимое имя"
	          });
	        }
	
	        var tplWithSameName = scope.templates.filter(function(t){ return t.name == tpl.name; })[0];
	        if((tplWithSameName && scope.isNewTpl) || (tplWithSameName && tplWithSameName.id !== tpl.id)){
	          errs.push({
	            field: "Название шаблона",
	            message: "Имя " + tpl.name + " уже знаято"
	          });
	        }
	
	        return errs;
	      },
	
				loadTemplates: function(sielent) {
					return pec.http.get('/api?', {
						action: 'load',
						domain: 'templates'
					}, sielent).then(function(response){
						return model = response.data || response
					});
				},
	
	      createWrapper: function (tpl) {
	        return pec.http.post("/api?", {
	          action: 'createTemplateWrapper',
						domain: 'templates',
	          template: tpl
	        }).then(function (e) {
	          debugger;
	          pec.events.emit('email:change', e);
	        })
	      },
	
	      getTemplates: function(templates, updated) {
	        var defTpl = pec.inject("$cookieStore").get('template'),
	            chosen = null,
	            $scope = this;
	
	        if(templates.length){
	          $scope.templates = templates;
	
	          if($scope.templateIsChosen){
	
	            chosen = _.filter(templates, function(tpl){
	              return tpl.name == (updated || defTpl);
	            })[0];
	
	            if(chosen){
	              $scope.templateIsChosen = true;
	              $scope.template = chosen;
	              $scope.chooseTpl(chosen, true);
	            }
	            $scope.templateUrl = "/files/" + $scope.template.name + "/wrapper.tpl";
	          }
	        }
	
	        return templates;
				},
	
				chooseTemplate: function(tpl){
					return pec.http.post('/api?', {
						action: 'choose',
						domain: 'templates',
						template: tpl
					}, true).then(function(response){
						return model = response.data || response;
					});
				},
	
				removeTemplate : function(tpl){
						return pec.http.post('/api?', {
							action: 'remove',
							domain: 'templates',
	            template: tpl2json(tpl)
						}).then(function(response){
							return model = response.data || response;
						});
				},
	
	      updateTemplate: function(tpl, name) {
	        return pec.http.post('/api?', {
	          action: 'update',
	          domain: 'templates',
	          template: tpl2json(tpl),
	          name: name
	        }).then(function(response){
	          return model = response.data || response;
	        })
	      },
	
				saveTemplate: function(tpl) {
					return pec.http.post('/api?', {
						action: 'save',
						domain: 'templates',
	          template : tpl2json(tpl)
					}).then(function(response){
	          return model = response.data || response;
	        });
				}
	    };
	  };
	};
	



	root.pec = pec;
})(this);
