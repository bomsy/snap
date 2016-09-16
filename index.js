var setup = require('./lib/setup.js');
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));

var dir = '.snapshots/';
var config = dir + 'config.json';
var configTemplate = {
  name: 'snapshots',
  previous: 0,
  latest: 0
};
var pkg = 'package.json';

exports = module.exports = function(options) {
  var cwd = process.cwd();
  if (options.args[0] === 'run') {
    fs.ensureDirAsync(dir)
      .then(fs.ensureFileAsync(config))
      .then(function() {
        return fs.readJsonAsync(pkg)
      })
      .then(function(pkgJson) {
        pkgJson.scripts.postinstall = pkgJson.scripts.postinstall ?
          pkgJson.scripts.postinstall + ';node ' + __dirname + '/scripts/postinstall.js' : 'node ' + __dirname + '/scripts/postinstall.js';

        pkgJson.scripts.postupdate = pkgJson.scripts.postupdate ?
          pkgJson.scripts.postupdate + ';node' + __dirname + '/scripts/postinstall.js' : 'node ' + __dirname + '/scripts/postinstall.js';
        return fs.writeJsonAsync(pkg, pkgJson)
      })
      .then(fs.writeJsonAsync(config, configTemplate))
      .catch(function(err) {
        console.log(err);
      })
  }
}
