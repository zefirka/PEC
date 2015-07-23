var root      = __dirname + "/../../public/",
    _public   = "../public/";

module.exports = {
  root : root, //the root of the project
  port : 3002,
  default_file : null, //default loading file

  language: 'ru', //language

  /* Meta tags */
  meta : {
    viewport : {
      initialScale : 1,
      userScalable : "no",
      initialScaleDouble : 1.0,
      maximumScaleDouble : 1.0
    },
    favicon : root + 'favicon.ico',
    description : "Pudra",
  },

  tplEngine : 'jade', // template engine

  views  : "views/",
  files : "../public/files/",


  controllers :  root + "controllers/",
  vendor   : "libs/",
  dependencies : "dependencies.js",

  isAuth : true, // DEBUG

  front : 'public/',
  back : 'node/',

  'static' : {
    adr : 'static/',
    images : 'img/',
    scripts: "js/" ,
    styles: "styles/css",
  },

  defaults : {
    lang: 'en',
    template: 'default'
  },

  env: 'dev',

  /* Development */
  dev : {
    logTime : false,
    logTpl : false,
    logAuth : false,
    logMorgan : false
  }
}
