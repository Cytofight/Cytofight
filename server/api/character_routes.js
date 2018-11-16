const router = require('express').Router()
module.exports = router
const {Character} = require('../db/models')

//Get heroes

router.get('/heroes', async (req, res, next) => {
  try {
    const heroes = await Character.findAll({
      where: {category: 'hero'}
    })
    res.json(heroes)
  } catch (err) {
    next(err)
  }
})

//Get villains

router.get('/villains', async (req, res, next) => {
  try {
    const villains = await Character.findAll({
      where: {category: 'villain'}
    })
    res.json(villains)
  } catch (err) {
    next(err)
  }
})
