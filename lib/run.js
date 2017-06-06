var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));
var fsSync = require('fs-extra');
var exec = require('child-process-promise').exec;
var chokidar = require('chokidar');

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
      throw err;
    }
  }

  fs.ensureDirAsync(dir)
    .then(fs.ensureFileAsync(configFile))
    .then(function() {
      return fs.readJsonAsync(pkg)
    })
    .then(function(pkgJson) {
      appName = pkgJson.name + '@' + pkgJson.version;
      var ps = '/postinstall';
      // create s symlink to the postinstall script
      return fs.ensureSymlinkAsync(rootdir + '/scripts' + ps,
       './node_modules/.hooks' + ps);
    })
    .then(function() {
      configTemplate.app = appName;
      return fs.writeJsonAsync(configFile, configTemplate);
    })
    .catch(function(err) {
      console.log(err);
    });
};
