const router = require('express').Router()
module.exports = router

router.use('/GameChat', require('./GameChat'))
router.use('/users', require('./users'))
router.use('/character_routes', require('./character_routes'))

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
