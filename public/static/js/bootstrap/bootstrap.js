//= include modules/core.js

var Bootstrap = {};

(function(){
	
	Bootstrap.responsive = {
		ranges : {
			xs: 320,
			sm: 480,
			md: 768,
			lg: 1024
		},
		sizes: {
			320: 'xs',
			480: 'sm',
			768: 'md',
			1024: 'lg'
		},
		rangeClasses : ['xs', 'sm', 'md', 'lg'],
		rangeSizes : [320, 480, 768, 1024],

	}

	Bootstrap.getRange = function(w, callback){
		var sizes = Bootstrap.responsive.ranges;
		
		if(typeof callback!=="function"){
			callback = function(n){
				return n;
			}
		}
		
		if(w>=sizes.lg){
			return callback('lg');
		}
		if(w>=sizes.md){
			return callback('md');
		}
		if(w>=sizes.sm){
			return callback('sm');
		}
		return callback('xs');
	}
	
})();

