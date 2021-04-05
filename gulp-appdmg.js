// https://github.com/Aluxian/gulp-appdmg

var appdmg = require('appdmg');
var through = require('through2');
// var gutil = require('gulp-util');

//var PluginError = gutil.PluginError;
var PLUGIN_NAME = 'gulp-appdmg';

module.exports = function(options) {
  var stream = through.obj(function(file, encoding, next) {
    next();
  }, function(callback) {
    var self = this;
    var ee = appdmg(options);

    ee.on('progress', function(info) {
      // gutil.log(info.current + '/' + info.total + ' ' + info.type + ' ' + (info.title || info.status));
      console.log(info.current + '/' + info.total + ' ' + info.type + ' ' + (info.title || info.status));
    });

    ee.on('error', function(err) {
      //self.emit('error', new PluginError(PLUGIN_NAME, err));
      console.error(PLUGIN_NAME, err)
      callback();
    });

    ee.on('finish', callback);
  });

  // returning the file stream
  stream.resume();
  return stream;
};