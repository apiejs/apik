module.exports = {
  "req": {
    "method": "get",
    "path": "/movies"
  },
  "res": {
    "status": 200,
    "body": function(ctx){
       ctx.body = ("Hello world!")
    },
    "headers": {
      "Content-Type": "text/plain"
    }
  }
}
