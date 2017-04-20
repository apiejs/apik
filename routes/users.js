
module.exports = {

  "res": {
    "status": 200,
    "body": [
      function(req, res, next) {
        console.log(req)
        res.json("sss")
        next()
      }, function(req, res, next){
        res.json("Hello world!")
      }
    ],
    "headers": {
      "Content-Type": "text/plain"
    }
  }
}
