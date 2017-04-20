// for test
var express = require('express')
var app = express()

var mount = require('./index');

// simple
// mount(app);

// with path
// mount(app, 'routes', true);

app.use(require('./a'))

// start server
app.listen(23018)

