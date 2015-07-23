var pkg       = require('../../package.json'),
    config    = require('../../node/config/config.js');

var scSrc     = config.vendor, /* vendor's public libraries destination */
    stSrc     = config.static.adr, /* static documents destination */
    stStyles  = stSrc + 'styles/css/',
    stScripts = stSrc + 'js/'

var scripts, styles;

if(config.env == 'dev'){

  scripts = [
    scSrc + 'angular/angular.min.js',
    scSrc + 'angular/angular-route.min.js',
    scSrc + 'angular/angular-cookies.min.js',
    scSrc + 'angular-sanitize/angular-sanitize.min.js',
    scSrc + 'angular-file/angular-file.js',

    scSrc + "jquery/jquery.min.js",
    scSrc + "jquery/jquery-ui.min.js",
    scSrc + "jquery/jquery.sticky.js",

    scSrc + 'warden/warden.js',

    stScripts + "app/bootstrap.js",

    stScripts + 'app/app.js',
    stScripts + 'app/launcher.js' ];

  styles = [
    stStyles + 'bootstrap.css',
    stStyles + 'main.css' ];

}else{
  scripts = [stScripts + 'build/libs.min.js'];
  styles  = [stStyles + 'build/main.min.css'];
}


module.exports = {
  title: pkg.name + " " + pkg.version,

  language: 'en-EN',
  viewport: config.meta.viewport,
  description: config.meta.description,

  favicon: "/favicon.ico",

  scripts: scripts,
  styles : styles,
}
