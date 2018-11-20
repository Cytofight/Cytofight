const db = require('./db')

// register models
require('./models')
require('./models/GameChat')

module.exports = db
