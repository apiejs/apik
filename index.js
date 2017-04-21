var fs = require('fs')
var path = require('path')
var requireDirectory = require('require-directory')
var routes = requireDirectory(module, './routes')
var debug = require('debug')('apie-koa')
var views = require('koa-views');
var serve = require('koa-static');
const Koa = require('koa');
const app = new Koa();

var router = require('koa-router')();

var stack = []

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
function mount(router) {
  var r = arguments[1] || routes;
  var pre = arguments[2] || '';
  
  for (var k in r) {
    var file = '/' + pre + '' + k + '.js';
    debug('mount route ' + file + " ");
    var path = '';
    
    debug(k)
    debug(r[k])
    
    if (k === 'apie.js' || k === 'app.js'|| k === 'package.json') {
      return
    }

    if (typeof r[k] == 'object' && !(r[k]['body'] || r[k]['res']) ){
      // console.log('this is a obj');
      mount(router, r[k], pre + k + '/');
    } else if(k === 'index') {
      path = '/'+ pre;
      _use(router, file, path, r[k]);
    } else {
      path = '/' + pre + '' + k;
      _use(router, file, path, r[k]);
    }
  }
}

function _use(app, file, path, handler) {
  // 配置的path优先于file里的path
  if (handler.path) path = handler.path 

  var router = require('./router')(app, path, handler)
  var method = router.shift()

  app[method].apply(app, router)
    
  _track_routes(file, path, method);
}

function _track_routes(file, path, method) {
   _cache_to_stack(file, path, method);
}

function _cache_to_stack(file, path, method) {
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
  console.log('\t\tApie Router Dump');
  console.log('******************************************************\n');

  for (var k in stack) {
    var obj = stack[k];
    // console.dir(k)
    // console.log(obj.file + obj.method + obj.path)
    table.push(
        [routes_folder_path + obj.file, obj.method, obj.path]
    );
  }

  table.push(
    ["system", 'get', '/apie.json']
  );

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

  r = path.resolve(require('path').dirname(require.main.filename), r)
  
  global.routes_folder_path = r;
  
  // debug('mount routes_folder_path = ' + r)
  routes = requireDirectory(module, r);
  
  // middlewares
  router.middlewares = require('./middlewares')(r)
  
  // TODO: views
  // app.set('views', path.join(r, 'views'));
  // app.set('view engine', 'pug');
  app.use(views(path.join(r, 'views'), { extension: 'pug' }))

  // static server
  // app.use(express.static(path.join(r, 'public')));
  // $ GET /package.json
  app.use(serve(path.join(r, 'public')));
  

  router.get('/api.json', function (ctx) {
    ctx.body = {
      data: stack
    }
  })

  // mount
  mount(router) ;
  
  app
    .use(router.routes())
    .use(router.allowedMethods());
  
  if(is_debug){
    _dump (routes_folder_path);
  }
}

module.exports = function () {
  var folder = '.'
  var port = 3000;
  var debug = false;
  
  if (arguments.length === 2) {
    folder = arguments[0]
    debug = arguments[1]
  }
  
  if (arguments.length === 3) {
    folder = arguments[0]
    port = arguments[1]
    debug = arguments[2]
  }
  
  if (debug === true) {
    console.dir(arguments)
  }
  
  mount_with_folder(app, folder, debug);
  
  app.listen(port)
}

module.exports.app = function () {
  var folder = arguments[0] || '.';
  var debug = arguments[1] || false;
  
  mount_with_folder(app, folder, debug);

  return app
}
