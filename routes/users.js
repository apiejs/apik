
module.exports = {
  "req": {
    "method": "get",
    "path": "/users"
  },
  "res": {
    "status": 200,
    "body": [function(req, res, next) {
      next()
    }, function(req, res){
       res.json("Hello world!")
    }],
    "headers": {
      "Content-Type": "text/plain"
    }
  }
}
