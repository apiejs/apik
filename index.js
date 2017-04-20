var fs = require('fs')
var requireDirectory = require('require-directory')
var routes = requireDirectory(module, './routes')
var express = require('express')

var app = express()
var stack = []
var port = 3000
/**
 * Mount routes with directory.
 *
 * Examples:
 *
 *     // mount routes in app.js
 *     require('./config/routes')(app);
 *
 * @param {Object} app
 * @param {Object} routes
 * @param {String} pre
 * @return 
 * @api public
 */
function mount(app) {
  var r = arguments[1] || routes;
  var pre = arguments[2] || '';
  
  for (var k in r) {
    var file = '/' + pre + '' + k + '.js';
    console.log('mount route ' + file + " ");
    var path = '';
    console.log(file)
    console.log(k)
    console.log(r[k])

    if (typeof r[k] == 'object' && !(r[k]['body'] || r[k]['res']) ){
      // console.log('this is a obj');
      mount(app, r[k], pre + k + '/');
    } else if(k === 'index') {
      path = '/'+ pre;
      _use(app, file, path, r[k]);
    } else {
      path = '/' + pre + '' + k;
      _use(app, file, path, r[k]);
    }
  }
}

function _use(app, file, path, handler) {
  // console.dir(handler)
  // console.log(handler.stack)
  if (handler.path) path = handler.path 

  var router = require('./router')(handler)

  app[router.method](path, router.handler);
  
  _track_routes(file, path, handler.stack);
}

function _track_routes(file, path, handle) {
  for(var i in handle){
    var _route = handle[i].route;
    // console.log(_route);
    // console.log(_route.stack);
    // console.log(_route.methods);
    if(!_route)continue;  //添加了非空的处理逻辑，挂载中间件的路由不予显示在路由列表中

    var params = _route.stack.params;
    
    for(var j in _route.methods){
      if(_route.path == '/'){
        _cache_to_stack(file, path, j);
      }else{
        _cache_to_stack(file, path + _route.path, j);
      }
    }
  }
}

function _cache_to_stack(file, path, method) {
  // console.log(file+ ' ' +method + ' ' + path)
  stack.push({
    file    : file,
    method  : method,
    path    : path
  });
}

function _dump(routes_folder_path) {
  var Table = require('cli-table');
  var table = new Table({ head: ["File", "Method", "Path"] });

  // console.log(stack)
  console.log('\n******************************************************');
  console.log('\t\tMoaJS Apis Dump');
  console.log('******************************************************\n');
  
  for (var k in stack) {
    var obj = stack[k];
    // console.dir(k)
    // console.log(obj.file + obj.method + obj.path)
    table.push(
        [routes_folder_path + obj.file, obj.method, obj.path]
    );
  }

  console.log(table.toString());
}

/**
 * Mount routes with directory.
 *
 * Examples:
 *
 *     // mount routes in app.js
 *     mount(app, 'routes2', true);
 *
 * @param {Object} app
 * @param {String} routes_folder_path
 * @param {Boolean} is_debug
 * @return 
 * @api public
 */
function mount_with_folder(app, routes_folder_path) {
  stack = [];// empty when enter
  
  var r         = arguments[1] || './routes';
  var is_debug  = arguments[2] || false;
  
  // console.log('mount routes_folder_path = ' + r)
  routes = requireDirectory(module, r);
  
  mount(app) ;
  
  if(is_debug){
    _dump (routes_folder_path);
  }
}

module.exports = function(folder, serverport) {
  if(serverport) port = serverport
  mount_with_folder(app, 'routes', true);
  
  app.listen(port)
}

module.exports.app = function (folder){
  mount_with_folder(app, 'routes', true);

  return app
}