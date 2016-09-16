
exports = module.exports = function(opts) {
  require('./lib/' + opts.args[0] + '.js')(opts, __dirname);
}
