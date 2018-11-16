import {
  addPlayer,
  addOtherPlayers
} from './addPlayers'
import Phaser from 'phaser'

export function preload() {
  this.load.image('ship', 'assets/PNG/whitebloodcell.png')
  this.load.image('otherPlayer', 'assets/PNG/whitebloodcell.png')
  this.load.image('star', 'assets/PNG/star_gold.png')
  this.load.image('histamines', 'assets/PNG/Effects/star1.png')
  this.load.image('mastCell', 'assets/PNG/Meteors/meteorGrey_tiny2.png')
  this.load.image('antibody', 'assets/PNG/antibody.png')
  this.load.image('dormantTCell', 'assets/PNG/dormantTCell.png')
}

const histamineParticles = 10
const numberOfMastCells = 10
const numberOfDormantTCells = 5

export function create() {
  //Initialize the players in the game
  const self = this
  this.socket = io()
  this.otherPlayers = this.physics.add.group()
  this.socket.on('currentPlayers', function (players) {
    Object.keys(players).forEach(function (id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id])
      } else {
        addOtherPlayers(self, players[id])
      }
    })
  })
  this.socket.on('newPlayer', function (playerInfo) {
    addOtherPlayers(self, playerInfo)
  })
  this.socket.on('disconnect', function (playerId) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy()
      }
    })
  })
  this.socket.on('playerMoved', function (playerInfo) {
    self.otherPlayers.getChildren().forEach(function (otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation)
        otherPlayer.setPosition(playerInfo.x, playerInfo.y)
      }
    })
  })

  //Create the keys to play the game
  this.cursors = this.input.keyboard.createCursorKeys()

  //These 'WASD' keys need to be refractored so that the keycode numbers aren't hardcoded in. Console logging of Phaser.KeyCode suggests the property doesn't exist?
  this.keyUp = this.input.keyboard.addKey(87); // W
  this.keyLeft = this.input.keyboard.addKey(65); // A
  this.keyDown = this.input.keyboard.addKey(83); // S
  this.keyRight = this.input.keyboard.addKey(68); // D
  this.keyFire = this.input.keyboard.addKey(32); // Spacebar

  this.blueScoreText = this.add.text(16, 16, '', {
    fontSize: '32px',
    fill: '#0000FF'
  });
  this.redScoreText = this.add.text(584, 16, '', {
    fontSize: '32px',
    fill: '#FF0000'
  });

  //Create the life stars and scoreboard associated with the collections
  this.socket.on('scoreUpdate', function (scores) {
    self.blueScoreText.setText('Blue: ' + scores.blue);
    self.redScoreText.setText('Red: ' + scores.red);
  });

  this.socket.on('starLocation', function (starLocation) {
    if (self.star) self.star.destroy();
    self.star = self.physics.add.image(starLocation.x, starLocation.y, 'star');
    self.physics.add.overlap(self.ship, self.star, function () {
      this.socket.emit('starCollected');
    }, null, self);
  });

  //Create automated mast cells and their histamine secretors
  //This code creates mast cells that secrete histamines. Histamines activate dormant immune cells to alert them of an active infection. Contact with the histamines being secreted should activate nearby dormant white blood cells: additional code is needed for this functionality; speed of cells and their secretion speeds should also be adjusted
  const particles = new Array(histamineParticles).fill(this.add.particles('histamines'))
  particles.forEach(particle => {
    const randomSpeed = Math.floor(Math.random() * 150)
    const randomX = Math.floor(Math.random() * 1000)
    const randomY = Math.floor(Math.random() * 10000)
    const secretors = particle.createEmitter({
      speed: randomSpeed,
      scale: {
        start: 1,
        end: 0
      },
      blendMode: 'ADD'
    })
    const mastCells = new Array(numberOfMastCells).fill(this.physics.add.image(randomX, randomY, 'mastCell'))
    mastCells.forEach(mastCell => {
      mastCell.setVelocity(30, 70)
      mastCell.setBounce(1, 1);
      mastCell.setCollideWorldBounds(true);
      secretors.startFollow(mastCell)
    })
  })


  //These dormant cells need to be dispersed randomly throughout the arena, have random speeds, and be able to interact with the histomines (particles) emitted by the mast cells
  const dormantTCells = this.physics.add.group({
    key: 'dormantTCell',
    repeat: numberOfDormantTCells,
    setXY: {
      x: 100,
      y: 100,
      stepX: 200
    }
  })
  dormantTCells.children.entries.forEach(cell => {
    const randomX = Math.floor(Math.random() * 10)
    const randomY = Math.floor(Math.random() * 100)
    dormantTCells.setVelocity(randomX, randomY)
    cell.setBounce(1, 1)
    cell.setCollideWorldBounds(true)
  })
  let circle = new Phaser.Geom.Circle(400, 300, 150)
  //  Randomly position the sprites within the circle
  Phaser.Actions.RandomCircle(dormantTCells.getChildren(), circle);
}
