#!/usr/bin/env node

var argv = process.argv
argv.shift()

var file_path = __dirname
var current_path = process.cwd()

var apie = require('./index')

apie(current_path + '/app')

// TODO: 初始化routes到当前目录

// TODO: apie ./xxx/yyy