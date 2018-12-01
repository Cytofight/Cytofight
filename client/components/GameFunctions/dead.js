import Phaser from 'phaser'

export default class Dead extends Phaser.Scene {
  constructor() {
    super('Dead')
  }

  preload() {
    this.load.script(
      'webfont',
      'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js'
    )
  }

  create() {
    const add = this.add
    const deadText = ['You DIED!']

    WebFont.load({
      google: {
        families: ['Nosifer']
      },
      active: function() {
        add
          .text(window.innerWidth / 2, window.innerHeight / 2, deadText, {
            fontFamily: 'Nosifer',
            fontSize: 112,
            color: 'red'
          })
          .setOrigin(0.5)
      }
    })
  }
}
