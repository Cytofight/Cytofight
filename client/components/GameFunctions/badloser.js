import Phaser from 'phaser'

var loserText

export default class BadLoser extends Phaser.Scene {
  constructor() {
    super('BadLoser')
  }

  create() {
    this.add
      .text(
        100,
        100,
        'Your invading hoard has been DEFEATED--\nthis is the end for you!'
      )
      .setFontSize(32)
  }
}
