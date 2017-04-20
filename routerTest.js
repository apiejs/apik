var config = require('./routes/simple.js')

var r = require('./router')(config)

// for test
var express = require('express')
var app = express()

app.use(r)

// start server
app.listen(2000)

