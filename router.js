var type = require('type-detect');
var express = require('express');
var compose = require('compose-middleware').compose
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// var router = express.Router();

var _req = require('./req.json')
var _res = require('./res.json')

module.exports = function (config) {
    var request = Object.assign({}, _req, config.req)
    var response = Object.assign({}, _res, config.res)

    var middlewares = [logger('dev'), bodyParser.json(), bodyParser.urlencoded({ extended: false }), cookieParser()]

    // console.log(request)
    // console.log(response)

    // 外优先
    for (var k in config) {
        // console.log(k)
        if (request[k]) request[k] = config[k]
        if (response[k]) response[k] = config[k]
    }

    // console.log("request")
    // console.log(request)
    // console.log(response)

    function build(source) {
        if (type(source) === "function") {
            middlewares.push(source)
        } else if (type(source) === 'Array') {
            middlewares.concat(source)
        } if (type(source) === 'Object') {
            middlewares.push(function (req, res) {
                res.json(source)
            })
        } else {
            // 转String
            middlewares.push(function (req, res) {
                var body = source
                res.setHeader('Content-Type', 'text/plain');
                res.setHeader('Content-Length', body.length);
                res.end(body);
            })
        }
    }

    build(response.body)

    console.log(middlewares)

    var handler = compose(middlewares)

    return {
        method: request.method,
        handler: handler
    }
};
