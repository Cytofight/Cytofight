import { throttle, fire, limitNumber, worldSize } from '../util'
import { ENGINE_METHOD_ALL } from 'constants';
const throttledFire = throttle(fire, 200)
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
        addPlayer.call(this, players[id])
      } else {
        addOtherPlayers.call(this, players[id])
      }
    })
  })
  this.socket.on('newPlayer', (playerInfo) => {
    addOtherPlayers.call(this, playerInfo)
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
    const cellData = {}
    this.epithelialCells = {}
    if (!cells || !cells.length) {
      console.log('getting in the if')
      // this.epithelialCells = new Array(numberOfEpithelialCells).fill(null).map(() => {
        // const randomEpithelialX = Math.floor(Math.random() * (worldSize.x - 100))
        // const randomEpithelialY = Math.floor(Math.random() * (worldSize.y - 100))
      //   const newCell = makeEpithelialCell.call(this, randomEpithelialX, randomEpithelialY)
      //   newCell.globalId = newCell.body.id
      //   cellData.push({x: randomEpithelialX, y: randomEpithelialY, tint: null, globalId: newCell.globalId})
      //   return newCell
      // })
      for (let i = 0; i < numberOfEpithelialCells; i++) {
        const randomEpithelialX = Math.floor(Math.random() * (worldSize.x - 100))
        const randomEpithelialY = Math.floor(Math.random() * (worldSize.y - 100))
        cellData[i] = {x: randomEpithelialX, y: randomEpithelialY, tint: null, globalId: i}
        this.epithelialCells[i] = makeEpithelialCell.call(this, cellData[i])
      }
      //emit new cells
      this.socket.emit('newEpithelialCells', cellData)
    } else {
      // this.epithelialCells = cells.map(cell => makeEpithelialCell.call(this, cell.x, cell.y, cell.tint, cell.globalId))
      for (let id in cells) {
        this.epithelialCells[id] = makeEpithelialCell.call(this, cells[id])
      }
    }
    this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
      // const matchingCell = this.epithelialCells.find(cell => (cell.body.id === bodyA.id || cell.body.id === bodyB.id))
      // if (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id) console.log('there was a collision! matching cell: ', matchingCell)
      // if (this.ship && this.ship.tintBottomLeft === 214 && 
      //   matchingCell &&
      //   (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id)) {
      //     console.log('something happened!')
      //   matchingCell.setTint(0xd60000)
      //   this.socket.emit('changedEpithelialCell', matchingCell.globalId)
      // }
      epithelialCellCollision.call(this, bodyA, bodyB)
    })
  })

  this.socket.on('dormantTCell', (cells) => {
    this.dormantTCells = {}
    if(!Object.keys(cells).length) {
      console.log("I WAS CREATED FOR THE FIRST TIME!!!")
      // this.dormantTCells = new Array(numberOfTCells).fill(null).map((_, index) => {
      //   const randomTCellX = Math.floor(Math.random() * (worldSize.x - 100))
      //   const randomTCellY = Math.floor(Math.random() * (worldSize.y - 100))
      //   const randomVelocityX = Math.floor(Math.random() * 8 - 4)
      //   const randomVelocityY = Math.floor(Math.random() * 8 - 4)
      //   const randomAngularVelocity = Math.random() * 0.5 - 0.25
      //   return makeTCell.call(this, {
      //     positionX: randomTCellX, positionY: randomTCellY, 
      //     velocityX: randomVelocityX, velocityY: randomVelocityY, 
      //     angle: 0, angularVelocity: randomAngularVelocity,
      //     globalId: index
      //   })
      // })
      // this.clientDormantTCells = [...this.dormantTCells] // the list of cells for whose behavior the player is responsible
      // this.socket.emit('newTCells', this.dormantTCells.map(cell => 
      //   ({positionX: cell.body.position.x, positionY: cell.body.position.y, 
      //     velocityX: cell.body.velocity.x, velocityY: cell.body.velocity.y, 
      //     angle: cell.body.angle, angularVelocity: cell.body.angularVelocity,
      //     globalId: cell.globalId})
      // ))
      this.cellData = {}
      for (let i = 0; i < numberOfTCells; i++) {
        const randomTCellX = Math.floor(Math.random() * (worldSize.x - 100))
        const randomTCellY = Math.floor(Math.random() * (worldSize.y - 100))
        const randomVelocityX = Math.floor(Math.random() * 8 - 4)
        const randomVelocityY = Math.floor(Math.random() * 8 - 4)
        const randomAngularVelocity = Math.random() * 0.5 - 0.25
        this.cellData[i] = {
          positionX: randomTCellX, positionY: randomTCellY, 
          velocityX: randomVelocityX, velocityY: randomVelocityY, 
          angle: 0, angularVelocity: randomAngularVelocity,
          globalId: i
        }
        this.dormantTCells[i] = makeTCell.call(this, this.cellData[i])
      }
      this.clientDormantTCells = {...this.dormantTCells}
      console.log('DONE MAKING T CELLS: ', this.clientDormantTCells)
      this.socket.emit('newTCells', this.cellData)
    } else {
      console.log("I was not. I was created by someone else who came before you")
      // this.dormantTCells = cells.map(cell => makeTCell.call(this, cell))
      // this.clientDormantTCells = []
      for (let id in cells) {
        this.dormantTCells[id] = makeTCell.call(this, cells[id])
      }
      this.clientDormantTCells = {}
      //TESTING
      const testingCellParams = {'999': {positionX: 50, positionY: 50, velocityX: 0, velocityY: 0, angle: 0, angularVelocity: 0, globalId: 999}}
      const testingCell = makeTCell.call(this, testingCellParams)
      console.log(testingCell)
      this.dormantTCells[999] = testingCell
      this.clientDormantTCells[999] = testingCell
      this.socket.emit('newTCells', testingCellParams)
    }
  })

  this.socket.on('addDormantTCells', (newCells, ownerId) => {
    // const newCells = newCellData.map(cell => makeTCell.call(this, cell))
    // console.log('T CELLS BEFORE ADDITION: ', this.dormantTCells)
    // this.dormantTCells.push(...newCells)
    // console.log('T CELLS AFTER ADDITION: ', this.dormantTCells)
    // if (ownerId === this.socket.id) this.clientDormantTCells.push(...newCells)
    for (let id in newCells) {
      const newCell = makeTCell.call(this, newCells[id])
      this.dormantTCells[id] = newCell
      if (ownerId === this.socket.id) this.clientDormantTCells[id] = newCell
      console.log('OWNERID VS SOCKET ID: ', ownerId, this.socket.id)
    }
  })

  this.socket.on('passDormantTCells', passedCells => {
    // for each cell passed on from the disconnecting player, find its corresponding cell in the game...
    // const cellsToTransfer = passedCells.map(inputCell => 
    //   this.dormantTCells.find(cell => 
    //     !clientDormantTCells.includes(cell) && 
    //     (cell.body.position.x >= inputCell.positionX - 4 || cell.body.position.x <= inputCell.positionX + 4) && 
    //     (cell.body.position.y >= inputCell.positionY - 4 || cell.body.position.y <= inputCell.positionY + 4)
    //   )
    // )
    // // and add it to the list of cells that the player is responsible for monitoring
    // this.clientDormantTCells.push(...cellsToTransfer)
    for (let id in passedCells) {
      this.clientDormantTCells[id] = this.dormantTCells[id]
    }
  })

  this.socket.on('changedEpithelialCellClient', globalId => {
    console.log(globalId)
    // const correspondingCell = this.epithelialCells.find(cell => cell.globalId === globalId)
    // console.log('found corresponding cell: ', correspondingCell)
    // correspondingCell.setTint(0xd60000)
    this.epithelialCells[globalId].setTint(0xd60000)
  })

}

const shipParams = {
  restitution: 0.9,
  friction: 0.15,
  frictionAir: 0.05
}

function addPlayer(playerInfo) {
  const randomX = Math.floor(Math.random() * (worldSize.x - 100))
  const randomY = Math.floor(Math.random() * (worldSize.y - 100))
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

  this.input.on("pointermove", function(pointer) {
    // VIEWPORT: 800x, 600y
    const adjustedPointerX = limitNumber(pointer.x + this.ship.x - 400, pointer.x, pointer.x + worldSize.x - 800)
    const adjustedPointerY = limitNumber(pointer.y + this.ship.y - 300, pointer.y, pointer.y + worldSize.y - 600)
    var angle = -Math.atan2(adjustedPointerX - this.ship.x, adjustedPointerY - this.ship.y) * 180 / Math.PI;
    this.ship.angle = angle;
  }, this)
  this.input.on("pointerdown", (event) => {
    throttledFire.call(this)
  })
}

function addOtherPlayers(playerInfo) {
  const randomX = Math.floor(Math.random() * (worldSize.x - 100))
  const randomY = Math.floor(Math.random() * (worldSize.y - 100))
  const otherPlayer = this.matter.add.image(randomX, randomY, 'ship')
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

function makeEpithelialCell({ x, y, tint, globalId }) {
  const cell = this.matter.add.image(
    x,
    y,
    'epithelialCell'
  )
  cell.setRectangle(cell.width, cell.height, {
    isStatic: true,
    ...defaultCellParams
  })
  if (tint) cell.setTint(tint)
  cell.globalId = globalId
  return cell
}

function makeTCell({ positionX, positionY, velocityX, velocityY, angle, angularVelocity, randomDirection, tint, globalId } ){
  const cell = this.matter.add.image(
    positionX,
    positionY,
    'dormantTCell'
  )
  cell.setCircle(cell.width / 2, defaultCellParams)
  cell.setVelocity(velocityX, velocityY)
  cell.randomDirection = randomDirection || {x: 0, y: 0}
  cell.body.angle = angle || 0
  cell.body.angularVelocity = angularVelocity || 0
  cell.globalId = globalId
  cell.activate = function() {
      this.setVelocity(0, 0) //PLACEHOLDER
      console.log("I'm a good guy now!")
      cell.setTint(0x01c0ff)
      cell.activated = true
    }
  if(tint) cell.setTint(tint)
  return cell
}

function epithelialCellCollision(bodyA, bodyB) {
  const matchingCellId = Object.keys(this.epithelialCells).find(key => (this.epithelialCells[key].body.id === bodyA.id || this.epithelialCells[key].body.id === bodyB.id))
  if (this.ship && this.ship.tintBottomLeft === 214 && 
    this.epithelialCells[matchingCellId] &&
    (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id)) {
      console.log('something happened!')
    this.epithelialCells[matchingCellId].setTint(0xd60000)
    this.socket.emit('changedEpithelialCell', matchingCellId)
  }
}

function tCellCollision(bodyA, bodyB) {
  const matchingCells = this.clientDormantTCells.filter(currCell => currCell.body.id === bodyA.id || currCell.body.id === bodyB.id)
  if (matchingCells.length) {
    this.socket.emit('changedTCells', matchingCells.map(cell => ({
      positionX: cell.body.position.x, positionY: cell.body.position.y,
      velocityX: cell.body.velocity.x, velocityY: cell.body.velocity.y,
      angle: cell.body.angle, angularVelocity: cell.body.angularVelocity,
      globalId: cell.globalId
    })))
  }
}