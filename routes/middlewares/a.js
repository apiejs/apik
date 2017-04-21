module.exports = function a (ctx, next) {
  console.log('a')
  return next()
}