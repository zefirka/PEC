function guiid(){
	return [1,2,3].map(function(){ return (Math.random()*1000)>>0}).join('-');
}

module.exports = [
	{
		id: guiid(),
		index: 0,
		type: 's',
		template: 'jade/template/salutation.tpl',
		form : 'jade/forms/text.tpl',
		repeat: false,
		name: 'Приветствие',
		quantitable: false,
		disabled: false,
		data: {
			syntax: "{{IF `( firstname STRING_EQI '')`}}Привет!{{ELSE}}Привет, [[firstname]]!{{ENDIF}}",
			text: 'Приветствие'
		}
	},
	{	
		index: 1,
		id: guiid(),
		type: 'p',
		template: 'jade/template/picture.tpl',
		form : 'jade/forms/picture.tpl',
		repeat: true,
		name: 'Картинка',
		quantitable: false,
		disabled: false,
		data: {
			link: '',
			url: '',
			alt: ''
		}
	},
	
	{	
		index: 2,
		id: guiid(),
		type: 't',
		template: 'jade/template/text.tpl',
		form : 'jade/forms/text.tpl',
		repeat: true,
		quantitable: false,
		disabled: false,
		name: 'Текстовый блок',
		data: {
			text: 'Hello world'
		}
	},

	{	
		index: 3,
		id: guiid(),
		type: 'r',
		template: 'jade/template/ribbon.tpl',
		form : false,
		repeat: false,
		quantitable: true,
		quantity: 0,
		disabled: false,
		name: 'Лента: акция',
		data: {
			singular : {
				number: 5,
				name : 'Лента: акция',
				width: 192,
				height: 36
			},
			plural : {
				width: 192,
				height: 35,
				number : 7,
				name : 'Лента: акции'
			}
		}
	},

	{	
		index: 3,
		id: guiid(),
		type: 'r',
		template: 'jade/template/ribbon.tpl',
		form : false,
		repeat: false,
		quantitable: false,
		quantity: 1,
		disabled: false,
		name: 'Новинки недели',
		data: {
			plural : {
				width: 232,
				height: 36,
				number : 1,
				name : 'Лента: новинки'
			}
		}
	},

	{	
		index: 4,
		id: guiid(),
		type: 'r',
		template: 'jade/template/ribbon.tpl',
		form : false,
		repeat: false,
		quantitable: true,
		quantity: 0,
		disabled: false,
		name: 'Лента: премьера',
		data: {
			singular : {
				number: 2,
				name : 'Лента: премьера',
				width: 224,
				height: 36
			},
			plural : {
				width: 228,
				height: 35,
				number : 6,
				name : 'Лента: премьеры'
			}
		}
	},

	{
		index: 5,
		id: guiid(),
		type: 'g',
		template: 'jade/template/table.tpl',
		form : 'jade/forms/table.tpl',
		repeat: true,
		quantitable: false,
		disabled: false,
		name: 'Таблица товаров',
		data: {
			
			prod1 : {
				img_link : 'http://pudra.ru',
				img_src : 'http://placehold.it/210x210.png',
				brand: 'Brand 1',
				name: 'Name 1',
				category: 'Категория 1', 
				price : 'Цена 1'
			},

			prod2 : {
				img_link : 'http://pudra.ru',
				img_src : 'http://placehold.it/210x210.png',
				brand: 'Brand 2',
				name: 'Name 2',
				category: 'Категория 2', 
				price : 'Цена 2'
			},
			
			prod3 : {
				img_link : 'http://pudra.ru',
				img_src : 'http://placehold.it/210x210.png',
				brand: 'Brand 3',
				name: 'Name 3',
				category: 'Категория 3', 
				price : 'Цена 3'
			}
			
		}
	}
]