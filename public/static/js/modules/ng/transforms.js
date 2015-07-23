pec.transforms.file = function(data){
  var formData = new FormData();

  var file = angular.copy(data.template.wrapper);
  delete data.template.wrapper

  formData.append("template", JSON.stringify(data.template));
  formData.append("file", file);
	debugger;
  return formData;
}
