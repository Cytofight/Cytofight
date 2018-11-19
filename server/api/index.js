const router = require('./GameChat')
module.exports = router

router.use('/users', require('./users'))
router.use('/character_routes', require('./character_routes'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
