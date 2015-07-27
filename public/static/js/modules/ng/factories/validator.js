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
