var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var fsSync = require('fs-extra');
var exec = require('child-process-promise').exec;

var dir = '.snapshots/';
var configFile = dir + 'config.json';
var configTemplate = {
  name: 'snapshots',
  previous: 0,
  latest: 0
};
var pkg = 'package.json';

exports = module.exports = function(opts, rootdir) {
  var runscript = 'node ' + rootdir + '/scripts/snapshot.js';
  var appName = '';
  try {
    fsSync.readJsonSync(configFile);
    console.log('snap is already running ...');
    return
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw error;
    }
  }

  fs.ensureDirAsync(dir)
    .then(fs.ensureFileAsync(configFile))
    .then(function() {
      return fs.readJsonAsync(pkg)
    })
    .then(function(pkgJson) {
      appName = pkgJson.name + '@' + pkgJson.version;
      pkgJson.scripts.postinstall = pkgJson.scripts.postinstall ?
        pkgJson.scripts.postinstall + ';' + runscript : runscript;

      pkgJson.scripts.postupdate = pkgJson.scripts.postupdate ?
        pkgJson.scripts.postupdate + ';' + runscript : runscript;
      return fs.writeJsonAsync(pkg, pkgJson)
    })
    .then(function() {
      configTemplate.app = appName;
      return fs.writeJsonAsync(configFile, configTemplate);
    })
    .catch(function(err) {
      console.log(err);
    })
};
