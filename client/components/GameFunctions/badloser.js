import Phaser from 'phaser'

export default class BadLoser extends Phaser.Scene {
  constructor() {
    super('BadLoser')
  }

  preload() {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )
  }
  create() {
    const add = this.add

    WebFont.load({
      google: {
        families: ['Nosifer']
      },
      active: function() {
        add
          .text(window.innerWidth / 2, 200, 'YOU LOSE', {
            fontFamily: 'Nosifer',
            fontSize: 64,
            color: 'blue'
          })
          .setOrigin(0.5)
      }
    })

    const loserText = [
      'Your invading horde has been DEFEATED--',
      'this is the the end for you!'
    ]
    this.add
      .text(window.innerWidth / 2, window.innerHeight / 2, loserText, {
        align: 'center'
      })
      .setFontSize(32)
      .setOrigin(0.5)
  }
}
