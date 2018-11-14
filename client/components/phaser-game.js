// var React = require('react-phaser')
import Phaser from 'phaser'
import React, {Component} from 'react'

const config = {
  type: Phaser.AUTO,
  parent: 'container',
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: {
        y: 0
      }
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
}

function preload() {
  this.load.image('ship', 'assets/PNG/playerShip1_red.png')
  this.load.image('otherPlayer', 'assets/PNG/ufoGreen.png')
}

function create() {
  const self = this
  this.socket = io()
  this.otherPlayers = this.physics.add.group()
  this.socket.on('currentPlayers', function(players) {
    Object.keys(players).forEach(function(id) {
      if (players[id].playerId === self.socket.id) {
        addPlayer(self, players[id])
      } else {
        addOtherPlayers(self, players[id])
      }
    })
  })
  this.socket.on('newPlayer', function(playerInfo) {
    addOtherPlayers(self, playerInfo)
  })
  this.socket.on('disconnect', function(playerId) {
    self.otherPlayers.getChildren().forEach(function(otherPlayer) {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy()
      }
    })
  })
  this.cursors = this.input.keyboard.createCursorKeys()
  this.socket.on('playerMoved', function(playerInfo) {
    self.otherPlayers.getChildren().forEach(function(otherPlayer) {
      if (playerInfo.playerId === otherPlayer.playerId) {
        otherPlayer.setRotation(playerInfo.rotation)
        otherPlayer.setPosition(playerInfo.x, playerInfo.y)
      }
    })
  })
}

function update() {
  if (this.ship) {
    if (this.cursors.left.isDown) {
      this.ship.setAngularVelocity(-150)
    } else if (this.cursors.right.isDown) {
      this.ship.setAngularVelocity(150)
    } else {
      this.ship.setAngularVelocity(0)
    }

    if (this.cursors.up.isDown) {
      this.physics.velocityFromRotation(
        this.ship.rotation + 1.5,
        100,
        this.ship.body.acceleration
      )
    } else if (this.cursors.down.isDown) {
      this.physics.velocityFromRotation(
        this.ship.rotation + 1.5,
        100,
        this.ship.body.acceleration
      )
    } else {
      this.ship.setAcceleration(0)
    }
    // this.physics.world.wrap(this.ship, 5)
    // emit player movement
    const x = this.ship.x
    const y = this.ship.y
    const r = this.ship.rotation
    if (
      this.ship.oldPosition &&
      (x !== this.ship.oldPosition.x ||
        y !== this.ship.oldPosition.y ||
        r !== this.ship.oldPosition.rotation)
    ) {
      this.socket.emit('playerMovement', {
        x: this.ship.x,
        y: this.ship.y,
        rotation: this.ship.rotation
      })
    }

    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    }
  }
}

function addPlayer(self, playerInfo) {
  self.ship = self.physics.add
    .image(playerInfo.x, playerInfo.y, 'ship')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40)
  if (playerInfo.team === 'blue') {
    self.ship.setTint(0x0000ff)
  } else {
    self.ship.setTint(0xff0000)
  }
  self.ship.setDrag(100)
  self.ship.setAngularDrag(100)
  self.ship.setMaxVelocity(200)
}

function addOtherPlayers(self, playerInfo) {
  const otherPlayer = self.add
    .sprite(playerInfo.x, playerInfo.y, 'otherPlayer')
    .setOrigin(0.5, 0.5)
    .setDisplaySize(53, 40)
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0x0000ff)
  } else {
    otherPlayer.setTint(0xff0000)
  }
  otherPlayer.playerId = playerInfo.playerId
  self.otherPlayers.add(otherPlayer)
}

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.game = null
  }

  componentDidMount() {
    this.game = new Phaser.Game(config)
  }

  render() {
    return (
      <div id="container">
        <h3> Prepare for Battle!</h3>
      </div>
    )
  }
}
