var mp = ['Method', 'Property'];

module.exports = {
  domains: {
    NG: {
      Factories : {
        Factory : mp
      },
      Controllers : {
        Controller : mp
      },
      Directives : {
        Directive : mp
      },
      Transforms : {
        Transform : mp
      }
    },
    Utils : [],

  },
  linkage : {
    Description : function(str){
      return str.replace(/\[(.+)\]/g, function(code){
        return '<code>' + code + '</code>';
      });
    }
  }
}
