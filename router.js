var fs = require('fs');
var type = require('type-detect');
var express = require('express');
var compose = require('compose-middleware').compose
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var _req = require('./req.json')
var _res = require('./res.json')

module.exports = function (path, config) {
    var request = Object.assign({}, _req, config.req)
    var response = Object.assign({}, _res, config.res)

    var middlewares = [
        logger('dev'), 
        bodyParser.json(), 
        bodyParser.urlencoded({ extended: false }), 
        cookieParser()
    ]

    // 外优先
    for (var k in config) {
        if (request[k]) request[k] = config[k]
        if (response[k]) response[k] = config[k]
    }

    build(middlewares, response)

    // var handler = compose(middlewares)

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
        middlewares.push(function (req, res) {
            res = enhanceResponse(res, response)
            res.json(source)
        })
    } else {
        // 转String
        if (/\.json$/.test(source)) {
            source = JSON.parse(fs.readFileSync(global.routes_folder_path + "/" + source).toString())
            middlewares.push(function (req, res) {
                res = enhanceResponse(res, response)
                res.json(source)
            })
        } else {
            middlewares.push(function (req, res) {
                var body = source
                res = enhanceResponse(res, response)

                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Length', body.length);
                res.end(body);
            })
        }
        
        
    }

    return middlewares
}
