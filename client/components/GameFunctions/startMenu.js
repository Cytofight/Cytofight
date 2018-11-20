import Phaser from 'phaser'

export default class startMenu extends Phaser.Scene {
  constructor() {
    super('startMenu')
  }
  preload() {
    this.load.image('ship', 'assets/PNG/b_cell.png')
    this.load.image('click', 'assets/PNG/play.png')
  }

  create() {
    const teamBlue = this.add
      .image(300, 300, 'ship')
      .setTint(0x01c0ff)
      .setInteractive()
    const random = this.add
      .image(400, 300, 'click')
      .setScale(0.25)
      .setInteractive()
    const teamRed = this.add
      .image(500, 300, 'ship')
      .setTint(0xd60000)
      .setInteractive()

    teamBlue.on(
      'pointerdown',
      function() {
        console.log('Imma blue')
        this.scene.start('gamePlay')
      },
      this
    )
    random.on(
      'pointerdown',
      function() {
        console.log('I dunno')
        this.scene.start('gamePlay')
      },
      this
    )
    teamRed.on(
      'pointerdown',
      function() {
        console.log('Imma red')
        this.scene.start('gamePlay')
      },
      this
    )
  }
}
