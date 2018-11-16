const Sequelize = require('sequelize')
const db = require('../db')

const Character = db.define('character', {
  name: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING
    //This tells you whether they are a villain or a hero
  },
  blurb: {
    type: Sequelize.TEXT
  },
  img: {
    type: Sequelize.STRING,
    defaultValue:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCeE-XUkjXgBWaqNaMprbN58CCXIOo8UxSQickhEYJw2b3Bae2dA'
  }
})

module.exports = Character
