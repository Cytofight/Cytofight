import Phaser from 'phaser'

export default class startMenu extends Phaser.Scene {
  constructor() {
    super('startMenu')
    this.team = ''
  }
  preload() {
    this.load.image('ship', 'assets/PNG/b-cell-transparent.png')
    this.load.image('click', 'assets/PNG/play.png')
  }

  create() {
    const teamBlue = this.add
      .image(window.innerWidth / 2 + 200, window.innerHeight / 2, 'ship')
      .setTint(0x01c0ff)
      .setInteractive()
    const random = this.add
      .image(window.innerWidth / 2, window.innerHeight / 2, 'click')
      .setScale(0.25)
      .setInteractive()
    const teamRed = this.add
      .image(window.innerWidth / 2 - 200, window.innerHeight / 2, 'ship')
      .setTint(0xd60000)
      .setInteractive()

    teamBlue.on(
      'pointerdown',
      function() {
        console.log('Imma blue')
        this.team = 'blue'
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
        this.team = 'red'
        this.scene.start('gamePlay')
      },
      this
    )
  }
}
