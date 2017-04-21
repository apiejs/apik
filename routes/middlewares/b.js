module.exports = function b (ctx, next) {
  console.log('b')
  return next()
}