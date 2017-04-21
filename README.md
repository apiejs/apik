# apie

apie = auto mount express routes with routes_folder_path

[![gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]

## Features

- Convention over configuration
- Support Router use FileName
- Support Auto-mount-router（Infinite nested directory）

## Install

with the simplest way, you can install apes as a cli module

```
$ [sudo] npm install --global apie
$ apie
```

apie will mount routes directory as Auto-mount-folder

## Usages

install as dependency

```
$ npm install --save apie
```

way 1

```
var apie = require('apie')

apie('./routes', 3000);
```

way 2

```
var apie = require(apie).app;

// return an express app
var app = apie('./routes');

// start server
app.listen(3000)
```

## Configuration

use `.json` for simple mock-api

```
{
    "body": {
        "json": "Hello Sang!"
    }
}
```

use `.js` for all features that expressjs supported

```
module.exports = {
    "body": "Hello world!"
}
```

## Api Examples

> **Response.body Oriented Programming(ROP)**

writing support

- string
- json
- jsonfile
- function
- middlewares
- view template(default pug)
- static server
- middlewares

### string

```
module.exports = {
    "path": "/json",
    "body": "Hello world!"
}
```

### json 

```
module.exports = {
    "path": "/json",
    "body": {
        "json": "Hello world!"
    }
}
```

### jsonfile

```
module.exports = {
    "path": "/jsonfile",
    "body": "demo.json"
}
```

### function

```
module.exports = {
    "path": "/json",
    "body": function(req, res){
       res.json("Hello world!")
    }
}
```

### middlewares

```
module.exports = {
    "path": "/json",
    "body":  [function(req, res, next) {
      next()
    }, function(req, res){
       res.json("Hello world!")
    }]
}
```

### view template


step1: app.js

```
var apie = require('./index').app;

// return an express app
var app = apie('./routes');

app.set('view engine', 'pug');

// start server
app.listen(3000)
```

step2: install pug template

```
npm install pug
```

step3: use res.render()

```
module.exports = {
    "path": "/view",
    "body": function (req, res) {
        res.render('index', { title: 'Express' });
    }
}
```

### static server

```
$ mkdir routes/public
```

and then create html/js/jcss/json file. it will be served as static server, all the same as express!

### middlewares

use express/connect middleware in middlewares folder

middlewares/a.js

```
module.exports = function a (req, res, next) {
  console.log('a')
  next()
}
```

config with middlewares options

middleware.js

```
module.exports = {
    "path": "/middleware",
    "middlewares": 'a',
    "body": {
        "json": "Hello middleware world!"
    }
}
```

middlewares.js

```
module.exports = {
    "path": "/middlewares",
    "middlewares": ['a', 'b'],
    "body": {
        "json": "Hello middlewares world!"
    }
}
```

## HTTP Api

get all api info at http://127.0.0.1:3000/apie.json

```
{"data":[{"file":"/all.js","method":"all","path":"/all"},{"file":"/api/index.js","method":"get","path":"/home"},{"file":"/api/user.js","method":"get","path":"/home1"},{"file":"/demo/path.js","method":"get","path":"/demo/path"},{"file":"/demo/demo/json.js","method":"get","path":"/demo/demo/json"},{"file":"/home.js","method":"get","path":"/home"},{"file":"/json.js","method":"get","path":"/json"},{"file":"/jsonfile.js","method":"get","path":"/jsonfile"},{"file":"/middleware.js","method":"get","path":"/middleware"},{"file":"/middlewares.js","method":"get","path":"/middlewares"},{"file":"/movies.js","method":"get","path":"/movies"},{"file":"/post.js","method":"post","path":"/post"},{"file":"/simple.js","method":"get","path":"/simple"},{"file":"/users.js","method":"get","path":"/users"},{"file":"/view.js","method":"get","path":"/view"}]}
```

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## 版本历史

- v1.0.7 add cli
- v1.0.5 refact
- v1.0.3 add api dump feature
- v1.0.2 rename index to /
- v1.0.0 初始化版本

## 欢迎fork和反馈

- write by `i5ting` i5ting@126.com

如有建议或意见，请在issue提问或邮件

## License

this repo is released under the [MIT
License](http://www.opensource.org/licenses/MIT).


[npm-image]: https://img.shields.io/npm/v/apie.svg?style=flat-square
[npm-url]: https://npmjs.org/package/apie
[gitter-image]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/i5ting/apie?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge