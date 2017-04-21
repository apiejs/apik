var fs = require('fs')
var type = require('type-detect')
var logger = require('koa-logger')
// var cookieParser = require('cookie-parser')
var bodyParser = require('koa-bodyparser')
var debug = require('debug')('apie-koa')

var _req = require('./req.json')
var _res = require('./res.json')

module.exports = function (app, path, config) {
    var request = Object.assign({}, _req, config.req)
    var response = Object.assign({}, _res, config.res)

    var middlewares = [
        logger(), 
        bodyParser() 
        // cookieParser()
    ]
    
    if (config.middlewares) {
      if (type(config.middlewares) === 'Array') {
        for (var k in config.middlewares) {
          var key = config.middlewares[k]
        
          if (app.middlewares[key]) {
            debug(app.middlewares[key] + "")
            middlewares.push(app.middlewares[key])
          }
        }
      } else if (type(config.middlewares) === 'string') {
        var key = config.middlewares
        middlewares.push(app.middlewares[key])
      } else {
        console.log("ignore config.middlewares")
      }
    }

    // 外优先
    for (var k in config) {
        if (request[k]) request[k] = config[k]
        if (response[k]) response[k] = config[k]
    }

    build(middlewares, response)
    
    debug(request.method + ' path = ' + path)
    debug(middlewares)
    
    return [request.method, path].concat(middlewares)
};

function enhanceResponse(res, response) {
    if (response.headers) res.set(response.headers)
    if (response.status) res.status(response.status)

    return res
}

function build(middlewares, response) {
    var source = response.body
    if (type(source) === "function") {
        middlewares.push(source)
    } else if (type(source) === 'Array') {
      for (var k in source){
        middlewares.push(source[k])
      }
    } else if (type(source) === 'Object') {
        middlewares.push(function (ctx) {
            // res = enhanceResponse(ctx.response, response)
            // res.json(source)
            ctx.body = source
        })
    } else {
        // 转String
        if (/\.json$/.test(source)) {
            source = JSON.parse(fs.readFileSync(global.routes_folder_path + "/" + source).toString())
            middlewares.push(function (ctx) {
                ctx.body = source
            })
        } else {
            middlewares.push(function (ctx) {
                ctx.body = rouce
            })
        }
    }

    return middlewares
}
