import Phaser from 'phaser'

export default class startMenu extends Phaser.Scene {
  constructor() {
    super('startMenu')
    this.team = ''
  }
  preload() {
    this.load.image('ship', 'assets/PNG/b-cell-transparent.png')
    this.load.image('click', 'assets/PNG/play.png')
    this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
  }

  create() {
    const add = this.add
    const input = this.input
    const scene = this.scene
    
      WebFont.load({
        google: {
            families: [ 'Plaster']
        },
        active: function ()
        {
            add.text(window.innerWidth / 2, window.innerHeight / 2, 'CYTOFIGHT', { fontFamily: 'Plaster', fontSize: 80, color: 'blue' }).
            setShadow(2, 2, "#333333", 2, false, true)
            .setOrigin(0.5)

            input.once('pointerdown', function () {
              scene.start('gamePlay')
            });
        }
    });
  }
}
