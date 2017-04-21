
module.exports = {
  "body": 
  [
    function(ctx, next) {
      next()
    }, function(ctx, next){
      return ctx.body = {
        key: "Hello world!"
      }
    }
  ]
}
