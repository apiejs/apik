var fs = require('fs')
var requireDirectory = require('require-directory')
var debug = require('debug')('mount-middlewares')

function m (dir) {
  var _dir = dir + "/middlewares"
  
  if (fs.existsSync(_dir)) {
    debug(_dir)
    return requireDirectory(module, _dir)
  }
  
  return {}
}

module.exports = m