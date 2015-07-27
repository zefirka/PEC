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
