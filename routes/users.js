
module.exports = {
  "body": 
  [
    function(req, res, next) {
      next()
    }, function(req, res, next){
      res.json({
        key: "Hello world!"
      })
    }
  ]
}
