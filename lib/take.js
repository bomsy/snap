var exec = require('child-process-promise').exec;

exports = module.exports = function(opts, rootdir) {
  var runscript = 'node ' + rootdir + '/scripts/snapshot.js';
  exec(runscript)
    .then(function() {
      console.log('snap: new snapshot taken');
    })
    .catch(function(err) {
      console.log('Error: ' + err);
    });
};
