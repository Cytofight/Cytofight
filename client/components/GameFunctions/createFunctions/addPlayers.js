import {
  throttle,
  fire,
  limitNumber,
  worldSize,
  resetCells,
  randomName
} from '../util'
import {
  epithelialCells,
  tCells,
  mastCells,
  infectedCells,
  redBloodCells
} from './index'
const throttledFire = throttle(fire, 200)
//Change name of file to init; this file will initialize all unites associated with the game that utilizes sockets

const numberOfEpithelialCells = 15
const numberOfTCells = 6
const numberOfMastCells = 1
const numberOfRedBloodCells = 15

//Initialize the players in the game
//change name of function to init()
//must STILL call with this
export function players() {
  // const self = this
  this.socket = io()
  this.otherPlayers = {}
  this.badGuys = {
    players: {},
    epithelialCells: {},
    infectedCells: {}
  }
  this.goodGuys = {
    players: {},
    tCells: {}
  }
  this.secretColor = {
    value: null,
    found: false
  }
  this.socket.on('currentPlayers', players => {
    for (let id in players) {
      if (id === this.socket.id) {
        addPlayer.call(this, players[id])
      } else {
        addOtherPlayers.call(this, players[id])
      }
    }
  })
  this.socket.on('newPlayer', playerInfo => {
    addOtherPlayers.call(this, playerInfo)
  })
  this.socket.on('disconnect', playerId => {
    if (this.otherPlayers[playerId]) {
      this.otherPlayers[playerId].nameText.destroy()
      this.otherPlayers[playerId].destroy()
    }
    delete this.otherPlayers[playerId]
    delete this.badGuys.players[playerId]
    delete this.goodGuys.players[playerId]
  })
  this.socket.on(
    'playerMoved',
    ({playerId, angle, position, velocity}) => {
      const currPlayer = this.otherPlayers[playerId]
      if (currPlayer) {
        currPlayer
          .setPosition(position.x, position.y)
          .setVelocity(velocity.x, velocity.y)
        // .setAngularVelocity(angularVelocity)
        // .setAngle(angle)
        currPlayer.nameText.x = position.x - (currPlayer.name.length * 5.85)
        currPlayer.nameText.y = position.y - 48
        currPlayer.body.angle = angle
      }
    }
  )

  this.socket.on('secretColor', color => {
    this.secretColor = color
  })

  epithelialCells.call(this, numberOfEpithelialCells)
  tCells.call(this, numberOfTCells)
  mastCells.call(this, numberOfMastCells)
  infectedCells.call(this)
  redBloodCells.call(this, numberOfRedBloodCells)

  //create events related to antibodies being fired from B cells
  this.socket.on('otherFiredAntibody', firingInfo => {
    throttledFire.call(this, firingInfo)
    if (firingInfo.type === 'tCell') {
      this.dormantTCells[firingInfo.id].body.angle = firingInfo.angle
    } else if (firingInfo.type === 'player') {
      this.otherPlayers[firingInfo.id].body.angle = firingInfo.angle
    }
  })

  this.socket.on('deleteOtherPlayer', playerId => {
    if (this.badGuys.players[playerId]) {
      this.badGuys.players[playerId].nameText.destroy()
      this.badGuys.players[playerId].destroy()
    }
    delete this.badGuys.players[playerId]
    //if this is you, display dead page. if game is over, winner or loser page
    if (!Object.keys(this.badGuys.players).length) {
      if (Object.keys(this.goodGuys.players).includes(this.socket.id)) {
        this.scene.start('Winner')
      } else {
        this.scene.start('BadLoser')
      }
    } else if (playerId === this.socket.Id) {
      this.scene.start('Dead')
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
  this.ship.setScale(0.7)
  this.ship.setCircle(this.ship.width / 2, {
    label: 'me',
    ...shipParams
  })
  this.ship.playerId = playerInfo.playerId

  // Create a random player name on top of the ship
  // const randomId = Math.floor(Math.random() * randomName.length)
  // const name = randomName[randomId]
  this.ship.name = playerInfo.name
  this.ship.nameText = this.add.text(
    this.ship.body.position.x - (this.ship.name.length * 5.85),
    this.ship.body.position.y - 48,
    `${this.ship.name}`,
    {fontSize: '20px', fill: '#01c0ff'}
  )

  this.cameras.main.startFollow(this.ship) //******* */
  if (playerInfo.team === 'blue') {
    this.ship.setTint(0x01c0ff)
    this.goodGuys.players[this.socket.id] = this.ship
  } else {
    this.ship.setTint(0xd60000)
    this.ship.health = 400
    this.badGuys.players[this.socket.id] = this.ship
  }

  this.input.on(
    'pointermove',
    function(pointer) {
      // VIEWPORT: innerWidthx, innerHeighty
      const adjustedPointerX = limitNumber(
        pointer.x + this.ship.x - window.innerWidth / 2,
        pointer.x,
        pointer.x + worldSize.x - window.innerWidth
      )
      const adjustedPointerY = limitNumber(
        pointer.y + this.ship.y - window.innerHeight / 2,
        pointer.y,
        pointer.y + worldSize.y - window.innerHeight
      )
      const angle =
        -Math.atan2(
          adjustedPointerX - this.ship.x,
          adjustedPointerY - this.ship.y
        ) *
        180 /
        Math.PI
      this.ship.angle = angle
    },
    this
  )
}

function addOtherPlayers({position, team, playerId, name}) {
  const otherPlayer = this.matter.add.image(position.x, position.y, 'ship')
  otherPlayer.setScale(0.7)
  otherPlayer.setCircle(otherPlayer.width / 2, {label: 'player', ...shipParams})
  otherPlayer.playerId = playerId
  this.otherPlayers[playerId] = otherPlayer
  if (team === 'red') {
    otherPlayer.setTint(0xd60000)
    otherPlayer.health = 400
    this.badGuys.players[playerId] = otherPlayer
  } else {
    otherPlayer.setTint(0x01c0ff)
    this.goodGuys.players[playerId] = otherPlayer
  }
  otherPlayer.name = name
  otherPlayer.nameText = this.add.text(
    position.x - (name.length * 5.85),
    position.y - 48,
    `${name}`,
    {fontSize: '20px', fill: '#01c0ff'}
  )
}

export function damageBadPlayer(newHealth, cell) {
  cell.setTint(0xffff33)
  setTimeout(() => cell.setTint(0xd60000), 100)
  cell.health = newHealth
  console.log('cell health: ', cell.health)
  if (cell.health <= 0) killBadPlayer.call(this, cell.playerId)
}

export function killBadPlayer(playerId) {
  let isBadTeam;
  console.log('Bad player killed!')
  if (this.badGuys.players[playerId]) {
    isBadTeam = true
    this.badGuys.players[playerId].destroy()
  }
  delete this.badGuys.players[playerId]
  console.log('Bad guys left:', Object.keys(this.badGuys.players).length)
  delete this.otherPlayers[playerId]
  this.socket.emit('deletePlayer', playerId)
  if (!Object.keys(this.badGuys.players).length) {
    isBadTeam ? this.scene.start('BadLoser') : this.scene.start('Winner')
    resetCells.call(this)
  }
}
