var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var exec = require('child-process-promise').exec;

var dir = '.snapshots/';
var config = dir + 'config.json';
var configTemplate = {
  name: 'snapshots',
  previous: 0,
  latest: 0
};
var pkg = 'package.json';

exports = module.exports = function(opts, rootdir) {
  var runscript = 'node ' + rootdir + '/scripts/postinstall.js';
  fs.ensureDirAsync(dir)
    .then(fs.ensureFileAsync(config))
    .then(function() {
      return fs.readJsonAsync(pkg)
    })
    .then(function(pkgJson) {
      pkgJson.scripts.postinstall = pkgJson.scripts.postinstall ?
        pkgJson.scripts.postinstall + ';' + runscript : runscript;

      pkgJson.scripts.postupdate = pkgJson.scripts.postupdate ?
        pkgJson.scripts.postupdate + ';' + runscript : runscript;
      return fs.writeJsonAsync(pkg, pkgJson)
    })
    .then(fs.writeJsonAsync(config, configTemplate))
    .catch(function(err) {
      console.log(err);
    })
};
