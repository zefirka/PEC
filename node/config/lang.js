var map,
    render = require("warden.js").Utils.interpolate,
    lang = __dirname + "/../../etc/langs/{{0}}.json";

module.exports = {
  init : function(code){

    try{
      map = require(render(lang, code));
    }catch(err){
      console.log(err);
    }finally{
      return function(namespace){
        return map[namespace] || "Namespace of lang not found";
      }
    }
  },
  change : function(code){
    return this.init(code);
  }
}
