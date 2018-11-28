import { throttle, fire, limitNumber, worldSize, defaultCellParams, setCellParams } from '../util'
import { epithelialCells, epithelialCellCollision, tCells, mastCells } from './index'
const throttledFire = throttle(fire, 200)
//Change name of file to init; this file will initialize all unites associated with the game that utilizes sockets

const numberOfEpithelialCells = 40
const numberOfTCells = 15
const numberOfMastCells = 4


//Initialize the players in the game
//change name of function to init()
//must STILL call with this
export function players() {
  // const self = this
  this.socket = io()
  this.otherPlayers = {}
  this.badGuys = {
    players: {},
    epithelialCells: {}
  }
  this.goodGuys = {
    players: {},
    tCells: {}
  }
  this.secretColor = {
    value: null,
    found: false
  }
  this.socket.on('currentPlayers', (players) => {
    for (let id in players) {
      if (id === this.socket.id) {
        addPlayer.call(this, players[id])
      } else {
        addOtherPlayers.call(this, players[id])
      }
    }
  })
  this.socket.on('newPlayer', (playerInfo) => {
    addOtherPlayers.call(this, playerInfo)
  })
  this.socket.on('disconnect', (playerId) => {
    this.otherPlayers[playerId].destroy()
    delete this.otherPlayers[playerId]
    if (this.badGuys.players[playerId]) delete this.badGuys.players[playerId]
    else delete this.goodGuys.players[playerId]
  })
  this.socket.on('playerMoved', ({
    playerId,
    angle,
    position,
    velocity,
    angularVelocity
  }) => {
    const currPlayer = this.otherPlayers[playerId]
    if (currPlayer) {
      currPlayer.setPosition(position.x, position.y)
        .setVelocity(velocity.x, velocity.y)
        // .setAngularVelocity(angularVelocity)
        // .setAngle(angle)
      currPlayer.body.angle = angle
    }
  })

  this.socket.on('secretColor', (color) => {
    this.secretColor = color
  })

  epithelialCells.call(this, numberOfEpithelialCells)
  tCells.call(this, numberOfTCells)
  mastCells.call(this, numberOfMastCells)

  this.socket.on('otherFiredAntibody', firingInfo => {
    throttledFire.call(this, firingInfo)
    if (firingInfo.type === 'tCell') {
      this.dormantTCells[firingInfo.id].body.angle = firingInfo.angle
    } else if (firingInfo.type === 'player') {
      this.otherPlayers[firingInfo.id].body.angle = firingInfo.angle
    }
  })


  this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
    // for various collision events
    // epithelialCellCollision.call(this, bodyA, bodyB)
  })
}

const shipParams = {
  restitution: 0.9,
  friction: 0.15,
  frictionAir: 0.05
}

function addPlayer(playerInfo) {
  const randomX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
  const randomY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
  this.ship = this.matter.add.image(randomX, randomY, 'ship')
  this.ship.setScale(0.5)
  this.ship.setCircle(this.ship.width / 2, {
    label: 'me',
    ...shipParams
  })
  this.cameras.main.startFollow(this.ship) //******* */
  if (playerInfo.team === 'blue') {
    this.ship.setTint(0xd60000)
    this.badGuys.players[this.socket.id] = this.ship
  } else {
    this.ship.setTint(0x01c0ff)
    this.goodGuys.players[this.socket.id] = this.ship
  }

  this.input.on("pointermove", function(pointer) {
    // VIEWPORT: 800x, 600y
    const adjustedPointerX = limitNumber(pointer.x + this.ship.x - 400, pointer.x, pointer.x + worldSize.x - 800)
    const adjustedPointerY = limitNumber(pointer.y + this.ship.y - 300, pointer.y, pointer.y + worldSize.y - 600)
    var angle = -Math.atan2(adjustedPointerX - this.ship.x, adjustedPointerY - this.ship.y) * 180 / Math.PI;
    this.ship.angle = angle;
  }, this)
}

function addOtherPlayers({ position, team, playerId }) {
  const otherPlayer = this.matter.add.image(position.x, position.y, 'ship')
  otherPlayer.setScale(0.5);
  otherPlayer.setCircle(otherPlayer.width / 2, shipParams)
  if (team === 'blue') {
    otherPlayer.setTint(0xd60000)
    this.badGuys.players[playerId] = otherPlayer
  } else {
    otherPlayer.setTint(0x01c0ff)
    this.goodGuys.players[playerId] = otherPlayer
  }
  otherPlayer.playerId = playerId
  this.otherPlayers[playerId] = otherPlayer
}
