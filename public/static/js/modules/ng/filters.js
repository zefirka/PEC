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
