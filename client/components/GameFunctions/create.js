import {players, keyboardControls, scoreAndStars} from './createFunctions'
import {Antibody} from '../phaser-game'
import {worldSize} from './util'

export function preload() {
  this.load.image('click', 'assets/PNG/play.png')
  this.load.image('ship', 'assets/PNG/b-cell-transparent.png')
  this.load.image('otherPlayer', 'assets/PNG/White_blood_cell_transparent.png')
  this.load.image('virus', 'assets/PNG/influenzaVirus.png')
  this.load.image('star', 'assets/PNG/star_gold.png')
  this.load.image('histamines', 'assets/PNG/histamine.png')
  this.load.image('mastCell', 'assets/PNG/mast_cell_transparent.png')
  this.load.image('antibody', 'assets/PNG/antibody-game-transparent.png')
  this.load.image('dormantTCell', 'assets/PNG/White_blood_cell_transparent.png')
  this.load.image('epithelialCell', 'assets/PNG/epithelial_cell.png')
  this.load.image('redBloodCell', 'assets/PNG/RedBloodCell.png')
  // Background image: make sure file is compressed using https://imagecompressor.com/
  this.load.image('redback', 'assets/PNG/redback.png')
  // Audio files
  this.load.audio('shoot', ['assets/PNG/FireSound.mp3'])
  this.load.audio('hitCell', ['assets/PNG/hitCell.mp3'])
  this.load.audio('smallexplosion', ['assets/PNG/smallexplosion.mp3'])
  this.load.audio('infectionUnderWay', ['assets/PNG/infectionUnderway.mp3'])
}

export function create() {
  //  The world is 3200 x 600 in size
  this.cameras.main.setBounds(0, 0, worldSize.x, worldSize.y).setName('main')

  // Create canvas background image
  this.add.image(worldSize.x / 2, worldSize.y / 2, 'redback').setScale(2.9)

  this.destroyedSound = this.sound.add('smallexplosion', {volume: 0.5})
  this.fireSound = this.sound.add('shoot', {volume: 0.5})
  this.damagedSound = this.sound.add('hitCell', {volume: 0.5})
  this.infectionSound = this.sound.add('infectionUnderWay', {volume: 0.9})

  //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
  this.minimap = this.cameras
    .add(0, 0, window.innerWidth / 8, window.innerHeight / 8)
    .setZoom(0.1)
    .setAlpha(0.8)
    .setName('mini')
  this.minimap.scrollX = worldSize.x
  this.minimap.scrollY = worldSize.y

  // PUT IN A SETUP FUNC
  this.matter.world.setBounds(0, 0, worldSize.x, worldSize.y)
  this.cameras.main.setBounds(0, 0, worldSize.x, worldSize.y)
  players.call(this)
  this.antibodies = this.add.group({
    classType: Antibody,
    maxSize: 100,
    runChildUpdate: true
  })
  keyboardControls.call(this)
  // this.socket.emit('securitronAndCone')

  console.log(this)
  this.blueScoreText = this.add
    .text(window.innerWidth - 480, 16, '', {
      fontSize: '24px',
      fontStyle: 'bold',
      fill: 'blue'
    })
    .setDepth(1)
    .setScrollFactor(0)
    .setStroke('yellow', 2)

  this.redScoreText = this.add
    .text(window.innerWidth - 480, 48, '', {
      fontSize: '24px',
      fontStyle: 'bold',
      fill: '#d60000'
    })
    .setDepth(1)
    .setScrollFactor(0)
    .setStroke('yellow', 4)

  scoreAndStars.call(this)

  // this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
  //   if (bodyA.label === 'tCell' || bodyB.label === 'tCell') console.log(bodyA.label, bodyB.label, bodyA, bodyB)
  //   if (bodyA.label === 'me' || bodyB.label === 'me') console.log(bodyA.label, bodyB.label, bodyA, bodyB)
  //   if ( bodyA.label = 'tCell' && (bodyB.label === 'me' || bodyB.label === 'player' || bodyB.label === 'infectedCell')) {
  //     // delegateDamage.call(this, bodyA, bodyB)
  //     console.log('bad guys is A', bodyA)
  //   } else if (bodyB.label = 'tCell' && (bodyA.label === 'me' || bodyA.label === 'player' || bodyA.label === 'infectedCell')) {
  //     // delegateDamage.call(this, bodyB, bodyA)
  //     console.log('bad guy is B', bodyB)
  //   }
  // })
}
