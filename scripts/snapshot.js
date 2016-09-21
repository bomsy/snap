var exec = require('child-process-promise').exec;
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require('fs-extra'));

var cwd = process.cwd();

var swfile = 'npm-shrinkwrap.json';
var dir = '.snapshots/';
var config = dir + 'config.json'

function timestampFile(filename, ts) {
  var fname = filename.split('.');
  fname[0] = fname[0] + '-' + ts;
  return fname.join('.');
}
var timestamp = new Date().getTime();
exec('npm shrinkwrap')
  .then(fs.ensureDirAsync(dir))
  .then(function() {
    return fs.moveAsync(swfile, dir + timestampFile(swfile, timestamp));
  })
  .then(function() {
    return fs.readJsonAsync(config)
  })
  .then(function(configJson) {
    configJson.previous = configJson.latest;
    configJson.latest = timestamp;
    return fs.writeJsonAsync(config, configJson);
  })
  .then(function() {
    console.log('new snapshot created - # ' + timestamp);
  })
  .catch(function(err) {
    console.log(err);
  });
