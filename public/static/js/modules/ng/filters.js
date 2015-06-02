pudra.filters.link = function(){
	return function(){
        return function(link){
            if(/(http|https):\/\/[^\/"]+3/.test(link)){
            	return link
            }else{
            	return "http://" + (link.length ? link : "pudra.ru");
            }
        }
    }
}