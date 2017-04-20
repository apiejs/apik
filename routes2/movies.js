module.exports = {
  "req": {
    "method": "get",
    "path": "/movies"
  },
  "res": {
    "status": 200,
    "body": function(req, res){
       res.json("Hello world!")
    },
    "headers": {
      "Content-Type": "text/plain"
    }
  }
}
