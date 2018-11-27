import Phaser from 'phaser'

export default class Winner extends Phaser.Scene {
  constructor() {
    super('Winner')
  }

  preload() {
    this.load.image('click', 'assets/PNG/play.png')
  }

  create() {
    console.log('text test')
    this.add.image(200, 200, 'play').setScale(0.25)
    this.add.text(200, 200, 'You WON!').setFontSize(64)
  }
}
