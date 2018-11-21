//Change name of file to init; this file will initialize all unites associated with the game that utilizes sockets

const numberOfEpithelialCells = 20
const numberOfTCells = 15
const defaultCellParams = {
  restitution: 1,
  friction: 0,
  frictionAir: 0
}

//Initialize the players in the game
//change name of function to init()
//must STILL call with this
export function players() {
  console.log("TOP OF PAGE THIS: ", this)
  // const self = this
  this.socket = io()
  this.otherPlayers = []
  this.socket.on('currentPlayers', (players) => {
    Object.keys(players).forEach((id) => {
      if (players[id].playerId === this.socket.id) {
        addPlayer.call(this, this, players[id])
      } else {
        addOtherPlayers.call(this, this, players[id])
      }
    })
  })
  this.socket.on('newPlayer', (playerInfo) => {
    addOtherPlayers.call(this, this, playerInfo)
  })
  this.socket.on('disconnect', (playerId) => {
    this.otherPlayers.forEach((otherPlayer) => {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.destroy()
        this.otherPlayers.filter(() => playerId !== otherPlayer.playerId)
      }
    })
  })
  this.socket.on('playerMoved', ({
    playerId,
    angle,
    position,
    velocity,
    angularVelocity
  }) => {
    this.otherPlayers.forEach((otherPlayer) => {
      if (playerId === otherPlayer.playerId) {
        otherPlayer.setPosition(position.x, position.y)
        otherPlayer.setVelocity(velocity.x, velocity.y)
        otherPlayer.setAngularVelocity(angularVelocity)
        otherPlayer.setAngle(angle)
      }
    })
  })

  this.socket.on('epithelialCell', (cells) => {
    if (!cells.length) {
      console.log('getting in the if')
      this.epithelialCells = new Array(numberOfEpithelialCells).fill(null).map(() => {
        const randomEpithelialX = Math.floor(Math.random() * 1000)
        const randomEpithelialY = Math.floor(Math.random() * 1000)
        return makeEpithelialCell.call(this, randomEpithelialX, randomEpithelialY)
      })
      //emit new cells
      console.log("cells: ", cells)
      this.socket.emit('newEpithelialCells', this.epithelialCells)
    } else {
      console.log('epithelialCells: ', this.epithelialCells)
      this.epithelialCells = cells.map(cell => makeEpithelialCell.call(this, cell.x, cell.y, cell.tint))
    }
    this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      // console.log('collision detected, emitting bodies:', bodyA)
      // console.log('ship id: ', this.ship.body.id)
      // console.log(this.epithelialCells)
      const matchingCell = this.epithelialCells.find(cell => (cell.body.id === bodyA.id || cell.body.id === bodyB.id))
      if (this.ship && matchingCell && (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id) && (this.ship.tintBottomLeft === 214)) {
        matchingCell.setTint(0xd60000)
      }
      // this.socket.emit('anyCollision', bodyA, bodyB)
    })
  })

  this.socket.on('dormantTCell', (cells) => {
    if(!cells.length) {
      this.dormantTCells = new Array(numberOfTCells).fill(null).map(() => {
        const randomTCellX = Math.floor(Math.random() * 500)
        const randomTCellY = Math.floor(Math.random() * 500)
        const randomVelocityX = Math.floor(Math.random() * 8 - 4) + 10
        const randomVelocityY = Math.floor(Math.random() * 8 - 4) + 10
        return makeTCell.call(this, randomTCellX, randomTCellY, randomVelocityX, randomVelocityY)
      })
      this.socket.emit('newTCells', this.dormantTCells)
    } else {
      this.dormantTCells = cells.map(cell => makeTCell.call(this, cell.x, cell.y))
    }
  })

}

const shipParams = {
  restitution: 0.9,
  friction: 0.15,
  frictionAir: 0.05
}

function addPlayer(self, playerInfo) {
  // self.ship = self.physics.add
  //   .image(playerInfo.x, playerInfo.y, 'ship')
  //   .setOrigin(0.5, 0.5)
  //   .setDisplaySize(53, 40)
  const randomX = Math.floor(Math.random() * 1000)
  const randomY = Math.floor(Math.random() * 1000)
  this.ship = this.matter.add.image(randomX, randomY, 'ship')
  this.ship.setScale(0.5)
  this.ship.setCircle(this.ship.width / 2, {
    label: 'me',
    ...shipParams
  })
  this.cameras.main.startFollow(this.ship) //******* */
  if (playerInfo.team === 'blue') {
    this.ship.setTint(0xd60000)
  } else {
    this.ship.setTint(0x01c0ff)
  }
  // self.ship.setDrag(100)
  // self.ship.setAngularDrag(100)
  // self.ship.setMaxVelocity(200)
}

function addOtherPlayers(self, playerInfo) {
  // const otherPlayer = self.add
  //   .sprite(playerInfo.x, playerInfo.y, 'otherPlayer')
  //   .setOrigin(0.5, 0.5)
  //   .setDisplaySize(53, 40)
  const randomXY = Math.floor(Math.random() * 1000)
  const otherPlayer = this.matter.add.image(randomXY, randomXY, 'ship')
  otherPlayer.setScale(0.5);
  otherPlayer.setCircle(otherPlayer.width / 2, shipParams)
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0xd60000)
  } else {
    otherPlayer.setTint(0x01c0ff)
  }
  otherPlayer.playerId = playerInfo.playerId
  this.otherPlayers.push(otherPlayer)
}

function makeEpithelialCell(x, y, tint) {
  this.cell = this.matter.add.image(
    x,
    y,
    'epithelialCell'
  )
  this.cell.setRectangle(this.cell.width, this.cell.height, {
    isStatic: true,
    ...defaultCellParams
  })
  if (tint) this.cell.setTint(tint)
  return this.cell
}

function makeTCell(positionX, positionY, velocityX, velocityY, tint){
  this.cell = this.matter.add.image(
    positionX,
    positionY,
    'dormantTCell'
  )
  console.log("THIS TCELL: ", this.cell)
  this.cell.setCircle(this.cell.width / 2, defaultCellParams)
  this.cell.setVelocity(velocityX, velocityY)
  this.cell.activate = function() {
      this.setVelocity(0, 0) //PLACEHOLDER
      console.log("I'm a good guy now!")
      this.cell.setTint(0x01c0ff)
      this.cell.activated = true
    }
    if(tint) this.cell.setTint(tint)
    return this.cell
}