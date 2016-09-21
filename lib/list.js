var fs = require('fs-extra');
var chalk = require('chalk');

exports = module.exports = function(opts, rootdir) {
  var cwd = process.cwd();
  var re = /\d+/;
  var i = 1;
  var files = [];
  var dir = '.snapshots/';
  var config = require(cwd + '/' + dir + 'config.json');
  fs.walk(dir)
    .on('data', function (file) {
      files.push(file)
    })
    .on('end', function () {
      files.reverse();
      console.log('total ' + (files.length - 2));
      console.log('     snapshot #       date created')
      files.forEach(function(file) {
        var match = file.path.match(re);
        var output = '';
        if (match !== null) {
          if (config.latest == match) {
            console.log(chalk.green(' ' + (i++) + '.  ' +  match + '    ' + file.stats.birthtime + ' *'));
          } else {
            console.log(' ' + (i++) + '.  ' +  match + '    ' + file.stats.birthtime);
          }
        }
      });
    });
};
