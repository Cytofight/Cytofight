import Phaser from 'phaser'

var loserText

export default class Loser extends Phaser.Scene {
  constructor() {
    super('Loser')
  }

  create() {
    this.add
      .text(100, 100, "You're infected--\nthis is the end for you!")
      .setFontSize(32)
  }
}
