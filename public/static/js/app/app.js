(function(root) {

	var _ = Warden.Utils;
	var pec = {
		consts : {
			$window: $(window)
		},
		static : 'views/',
		bootstrap : Bootstrap,
		routes: {},
		functional : {},
		api : {},
		events: Warden({}),
		controllers : {},
		directives : {},
		filters : {},
		transforms : {}

	}

	/* Function returns controller */
	pec.getController = function(route){
		var c = pec.controllers[route.controller] || pec.controllers[route.name] || pec.controllers[route.route];
		return typeof route.controller == 'function' ? route.command : c;
	}
pec.routes = {
	home : {
		route : ['/', '', 'home'],
		tpl : 'pages/static/index.tpl',
		controller : 'indexCtrl',
	},

	dashboard: {
		route: ["/dashboard", "dashboard"],
		tpl: 'dashboard/dashboard.tpl',
		controller : 'mainCtrl',
	},

	'dashboard/templates/new': {
		route: ['dashboard/templates/new'],
		tpl: 'dashboard/edit.tpl',
		controller : 'editTemplate',
	},

	'dashboard/templates/edit/:id': {
		route: ['dashboard/templates/edit/:id'],
		tpl: 'dashboard/edit.tpl',
		controller : 'editTemplate',
	},

	'dashboard/templates/delete/:id': {
		route: ['dashboard/templates/delete/:id'],
		tpl: 'dashboard/delete.tpl',
		controller : 'deleteTemplate',
	},

	'dashboard/templates': {
		route: ['dashboard/templates'],
		tpl: 'dashboard/templates.tpl',
		controller : 'templatesList'
	},

	'dashboard/constructor': {
		route: ['dashboard/constructor'],
		tpl: 'dashboard/constructor.tpl'
	},

	'404' : {
			controller : 'notFoundCtrl',
			route : ['/404', '404'],
			tpl : 'pages/404.tpl',
	}
}

	/**
		#guiid
	
		Domain: Utils
		Name: guiid
		Description: generates unique id
		Signature: {  -> string }
	*/
	function guiid(){
		return [0,0,0,0].map(function(){ return (Math.random()*1000)>>0}).join('-');
	}
	
	
	/**
		Domain: Utils
		Name: match
		Description: finds from [arr] first item where [param] of item equals to [value]
		Signature: { array: arr, string: param, mixed : value -> mixed : result
	*/
	function match(arr, param, value){
		return arr.filter(function(item){
			return item[param] == value;
		})[0];
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
	
	//
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
	
	pec.cache = (function(){
	  var store = {};
	
	  function cache(namespace, data){
	    store[namespace] = data;
	  }
	
	  cache.isCached = function(namespace){
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
	
			if(!options.preventBefore){
		    pec.api.emit('before:' + method, {
		      sielent : options.sielent || sielent,
		      url: url,
		      options: options
		    });
			}
	
	    options.sielent = sielent;
			console.log("Doing request", options)
	    return pec
	      .inject('$http')({
					method: method.toUpperCase(),
					url: url,
					params: options.params,
					data: options.data,
					headers: options.headers,
					transformRequest: options.transformRequest
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
	
	var tplMock = {
		name: '',
		templates: '',
		variables : []
	}
	
	
	
	/* Index page ctrl */
	pec.controllers.indexCtrl = ['templates', '$scope',  function(templates, $scope){
		templates.cache();
		$scope.test = "ALLHU AKBAR"
	}];
	
	
	/* Main dashboard controller */
	pec.controllers.mainCtrl = ['$scope', 'templates', function($scope, templates) {
	  var $cookie = pec.inject("$cookieStore"),
	      defTpl = $cookie.get('template');
	
	  $scope.templateIsChosen = _.is.exist(defTpl) ? true : false;
	
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
	
	
	    templates
	      .loadTemplates(true)
	      .then(templates.getTemplates.bind($scope))
	      .then(function(){
	        $scope.templateIsChosen = false;
	
	        // pec.events.emit('popup:open', {
	        //   url: "views/templates.tpl",
	        //   onClose : function(){
	        //     $scope.templateIsChosen = true;
	        //   },
	        //   onCancle : function(a, next){
	        //     $scope.templateIsChosen = true;
	        //     next();
	        //   }
	        // });
	      });
	  }
	
	  $scope.deleteTemplate = function() {
	    $scope.innerButtons = true;
	    pec.events.emit('popup:open', {
	      url: 'views/popups/warn.tpl',
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
	      url: 'views/popups/edit.tpl',
	      css: 'new-template',
	      dependencies: ['wyswig.editor']
	    });
	  }
	
	  /* Editing template */
	  $scope.message = "Добавить новую переменную";
	  $scope.heading = "Переменные";
	
	  /* INITIALIZING */
	  /* Loading and caching templates */
	  templates.cache(function(tpls){
	    templates.getTemplates.bind($scope)(tpls);
	  })
	}];
	
	
	/* Edit template controller */
	//= include controllers/editTemplateCtrl.js
	
	/* Edti constructor controller */
	//= include controlles/editCtrl.js
	
	
	/**
		#edit-template
		Domain: NG.Controllers.Controller {as <controller>}
		Name: editTemplate
		Description: template editing controller
		Dependecies: $scope, NG.Factories.Factory.templates
	*/
	pec.controllers.editTemplate = ['$scope', 'templates', function($scope, templates){
		var id = pec.inject('$routeParams').id;
	
		$scope.isNew = id ? false : true;
		$scope.tpl = tplMock;
		$scope.errors = [];
	
	
		templates.cache(function(result){
			$scope.templates = result
			$scope.tpl = id ? match($scope.templates, 'id', id) : tplMock;
		});
	
		$scope.save = function(){
			debugger;
		}
	
	
		$scope.toggleEditor = function(){
			debugger;
			$scope.innerButtons = true;
			pec.events.emit('popup:open', {
				url: 'views/popups/editor.tpl',
				onSave : function(scope, next){
					debugger;
				}
			})
		}
	
	}];
	
	
	pec.controllers.templatesList = ['$scope', 'templates', function($scope, templates){
		templates.cache(function(result){
			$scope.templates = result
		}, true);
	
		$scope.chooseTpl = function(tpl){
			debugger;
		}
	}];
	
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
	          // $("body .g-wrapper").addClass("distant");
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
	      templateUrl: 'views/directives/popup.tpl'
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
	      templateUrl : 'views/directives/blocks.tpl'
	    }
	  }
	}
	pec.directives.compiller = function(){
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
	        var speed = parseInt(attr.speed || 100),
	            $conj = $("." + attr['class']),
	            $el = $(element),
	            $timeout = pec.inject('$timeout');
	
	        function response(){
	          $timeout(function(){
	            $conj.removeClass("notready");
	            $el.fadeOut(speed);
	          }, parseInt(attr.timeout) || 1000);
	        }
	
	        pec.api.listen('before:*',function(e){
	          if(!e.sielent){
	            $(element).fadeIn(100);
	          }
	        });
	
	        pec.api.listen('after:*', response);
	
	        if(attr.init == 'true'){
	          $conj.addClass("notready");
	          $(element).show();
	        }else{
	          $(element).hide();
	        }
	
	      },
	      templateUrl: 'views/directives/preloader.tpl'
	    }
	  }
	}
	
	
	
	
	pec.directives.pecTrigger = function(){
	  return function(){
	    return {
	      scope: false,
	      restrict: 'A',
	      link: function(scope, element, attr){
	        var sp = attr.pecTrigger.split(':');
	
	        if(sp.length > 2){
	          console.error("ERROR: pec-trigger value error. Allowed: pec-trigger=\"eventname:xpath\"");
	        }
	
	        var evt = sp[0],
	            id = sp[1];
	
	        $(element).on(evt, function(event){
	          var elem = document.getElementById(id),
	              newEvent = document.createEvent("MouseEvents");
	
	          newEvent.initEvent(evt, true, false);
	          elem.dispatchEvent(newEvent);
	        });
	      }
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
	
	/*
	 *  Directive: <pec-form>
	 *  Restrict: Element
	 *  Usage: {
	 *    @block: templates/edit
	 *    @position: main
	 *  }
	 */
	/**
	  #pec-form
	
	  Domain: NG.Directives.Directive
	  Name: pecForm
	  Description: {}
	  Dependecies : []
	  
	*/
	
	pec.directives.pecForm = function(){
	  return function(){
	    return {
	      restrict: 'E',
	      transclude: true,
	      link: function(scope, element, attr){
	        var $form = $(element);
	
	        var id = 0,
	            optid = 0;
	
	        var $parse = pec.inject("$parse");
	
	        scope.fields = $parse(attr.fields)(scope);
	
	        scope.$watch("tpl", function(n,o){
	          if(n){
	            scope.fields = $parse(attr.fields)(scope).map(JSON2Fields);
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
	
	        scope.chooseFile = function(){
	          $form.find('input[type="file"]').click();
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
	      templateUrl: 'views/directives/form.tpl'
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
	      templateUrl: 'views/directives/ngform.tpl'
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
	      templateUrl: 'views/list.tpl'
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
	
	          var cw   = table.width(),
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
	
	pec.directives.sizematch = function(){
	  return function(){
	    return {
	      restrict: 'A',
	      transclude: false,
	      link: function(scope, element, attr){
	        function match(){
	          pec.bootstrap.responsive.rangeClasses.forEach(function(className){
	            element.removeClass('g-' + className);
	          });
	
	          element.addClass('g-' + pec.bootstrap.getRange(pec.consts.$window.width()));
	        }
	
	        pec.consts.$window.resize(match);
	        match();
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
				templateUrl: 'views/item.tpl'
			}
		}
	}
	
	pec.directives.pecUpload = function(){
		return function(){
	    return {
	      restrict: 'A',
	      scope: true,     //create a new scope
	      link: function (scope, el, attrs) {
	        el.bind('change', function (event) {
	            var files = event.target.files;
	
	            //iterate files since 'multiple' may be specified on the element
	            _.each(files, function(file){
	                //emit event upward
	                scope.$emit("setWrapper", { file: file });
	            });
	
	        });
	      }
	    }
	  }
	}
	
	
	/**
	
	*/
	
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
	
	/**
	  #factories
	
	  Domain: NG.Factories
	  Description: contains all factories of [NG](#ng)
	*/
	pec.factories = {};
	
	/* Validator factory module */
	/**
		#validator
	
		Domain: Factory
		Description: Validator service
	*/
	
	pec.factories.validator = function(){
	
	
		function validateName(name){
			var allowedRX = /[A-Za-z_][_\-A-Za-z0-9\.]+/,
					decSymbolsRX = /([ \#\$\%\^\&\*\(\)\+\=\@\!\\\/\;\:\,\`])/g;
	
			var res = "";
	
			if(!allowedRX.test(name)){
				res += "Недопустимое имя: ";
	
				name.match(decSymbolsRX).forEach(function(symbol){
					if(symbol == " "){
						res+= "пробелы не разрешены, ";
					}else{
						res+= "символ " + symbol + " не разрешен, ";
					}
				});
	
				res.slice(-2);
			}
	
			return res;
		}
	
	
		function validate(data){
	    var tpl = data.tpl,
					templates = data.templates;
	
			var errs = [];
	
			var nameValidation = validateName(tpl.name);
	
	    if(nameValidation){
	      errs.push({
	        field: "Название шаблона",
	        message: nameValidation
	      });
	    }
	
	    var tplWithSameName = match(templates, 'name', tpl.name);
	
			if(
				(tplWithSameName && data.isNewTpl) ||
				(tplWithSameName && tplWithSameName.id !== tpl.id)){
	
				errs.push({
	        field: "Название шаблона",
	        message: "Имя " + tpl.name + " уже знаято"
	      });
	    }
	
	    return errs;
	  }
	
	  return function(){
	
	    return {
	      template: function(data){
					return validate(data);
	      }
	    }
	  }
	}
	
	
	/* Templates factory module */
	/**
	  Domain: NG.Factories.Factory
	  Name: templates
	  Description: service provides API to work with templates
	*/
	
	pec.factories.templates = function(){
	  var API = "/templates?";
	
	  return function() {
	    var Validator = pec.inject('validator');
	    var model = {};
	
	
	    function saveModel(response){
	      return model = response.data || response;
	    }
	
	    return {
	      /***
	        Domain: NG.Factories.Factory.Method
	        Name: validate
	        Description: validates template
	        Signature: {object} -> {array}
	      */
	      validate: function(data){
	        return Validator.template(data);
	      },
	
	      /**
	        Domain: Factory.Method
	        Name: loadTemplates
	        Description: loads templates from server
	        Signature: {boolean : sielent} -> {promise}
	
	        Usage: {
	          sielent : if [true] then request will not trigger [ajax loading-box](#ajax-loading-box)
	        }
	      */
	      loadTemplates: function(sielent) {
	        return pec.http.post(API, {
	          params: {
	            action: 'load'
	          },
	          sielent: sielent
	        }).then(saveModel);
	      },
	
	      /**
	        #templates.cache
	
	        Domain: Factory.Method
	        name: cache
	        Description: caches templates or return cached if they have been already cached.
	        Signature: {function : fn, boolean : preloading }  -> {array}
	
	        Usage: {
	          fn : callback which will be called when method will recieve templates,
	          preloading : if [true] then request will trigger [ajax loading-box](#ajax-loading-box)
	        }
	      */
	      cache : function(fn, preloading){
	        var self = this,
	            $timeout = pec.inject('$timeout'),
	            templates = pec.cache.get('templatesLoaded') ? pec.cache.get('templates') : false;
	
	        if(!templates){
	
	          if(preloading){
	              pec.api.emit('before:load');
	          }
	
	          $timeout(function(){
	            self.loadTemplates(true).then(function(tpls){
	              pec.cache('templates', tpls);
	              pec.cache('templatesLoaded', true);
	              fn && fn(tpls);
	            });
	
	          }, 1000);
	        }else{
	          fn && fn(templates);
	        }
	
	        return templates;
	      },
	
	
	      /**
	        #templates.getTemplates
	
	        Domain: NG.Factories.Factory.Method
	        name: getTemplates
	        Description: binds templates to the scope
	        Signature: {array : templates, boolean : updated }  -> {array : templates
	      */
	      getTemplates: function(templates, updated) {
	        var defTpl = pec.inject("$cookieStore").get('template'),
	            chosen = null,
	            $scope = this;
	
	        if(templates.length){
	          $scope.templates = templates;
	
	          if($scope.templateIsChosen){
	
	            chosen = match(templates, 'name', updated || defTpl);
	
	            if(chosen){
	              $scope.templateIsChosen = true;
	              $scope.template = chosen;
	              $scope.chooseTpl && $scope.chooseTpl(chosen, true);
	            }
	            $scope.templateUrl = "/files/" + $scope.template.name + "/wrapper.tpl";
	          }
	        }
	
	        return templates;
	      },
	
	      chooseTemplate: function(tpl){
	        return pec.http.post(API, {
	          params: {
	            action: 'choose',
	            template: tpl },
	          sielent : true
	        }).then(saveModel);
	      },
	
	      removeTemplate : function(tpl){
	          return pec.http.post(API, {
	            data: {
	              action: 'remove',
	              domain: 'templates',
	              template: tpl2json(tpl) },
	            sielent: false
	          }).then(saveModel);
	      },
	
	      updateTemplate: function(tpl, name) {
	        return pec.http.post(API, {
	          data: {
	            action: 'update',
	            domain: 'templates',
	            template: tpl2json(tpl),
	            name: name },
	          transformRequest: pec.transforms.file,
	          headers: {
	            'Content-Type': void 0
	          },
	          sielent: false
	        }).then(saveModel)
	      },
	
	      saveTemplate: function(tpl) {
	        return pec.http.post(API, {
	          data: {
	            action: 'save',
	            domain: 'templates',
	            template : tpl2json(tpl) },
	          transformRequest: pec.transforms.file,
	          headers: {
	            'Content-Type': undefined
	          },
	          sielent : false
	        }).then(saveModel);
	      }
	    };
	  };
	};
	
	
	pec.transforms.file = function(data){
	  var formData = new FormData();
	
	  var file = angular.copy(data.template.wrapper);
	  delete data.template.wrapper
	
	  formData.append("template", JSON.stringify(data.template));
	  formData.append("file", file);
		debugger;
	  return formData;
	}
	


	root.pec = pec;
	root._ = _;
})(this);
