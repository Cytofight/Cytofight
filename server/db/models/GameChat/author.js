const Sequelize = require('sequelize')
const db = require('../../db')

const images = [
  'https://www.kathysmith.com/wp-content/uploads/2015/10/tmp578303633192386562.jpg',
  'https://media.gettyimages.com/photos/lymphocyte-white-blood-cells-sem-picture-id548000273',
  'https://cdn-ssl.funkidslive.com/wp-content/uploads/2017/08/white-blood-cells.jpg',
  'https://actu.epfl.ch/image/12429/original/2001x1501.jpg',
  'http://blogs.nature.com/spoonful/files/2013/03/shutterstock_101480467.jpg'
]

const getRandomImage = () => images[Math.floor(Math.random() * images.length)]

module.exports = db.define('author', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    defaultValue: function () {
      return getRandomImage()
    }
  }
})