import Phaser from 'phaser'

export default class Winner extends Phaser.Scene {
  constructor() {
    super('Winner')
  }

  preload() {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )
  }

  create() {
    const add = this.add
    const winnerText = ['You WON!']

    WebFont.load({
      google: {
        families: ['Alegreya SC']
      },
      active: function() {
        add
          .text(window.innerWidth / 2, window.innerHeight / 2, winnerText, {
            fontFamily: 'Alegreya SC',
            fontSize: 112,
            color: 'gold'
          })
          .setOrigin(0.5)
      }
    })
  }
}
