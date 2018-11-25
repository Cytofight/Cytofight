import { throttle, fire, limitNumber, worldSize, activate, defaultCellParams, setCellParams } from '../util'
import { epithelialCells, epithelialCellCollision, tCells } from './index'
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
  this.otherPlayers = []
  this.badGuys = []
  this.goodGuys = []
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
        // otherPlayer.setAngularVelocity(angularVelocity)
        // otherPlayer.setAngle(angle)
        otherPlayer.body.angle = angle
      }
    })
  })

  epithelialCells.call(this, numberOfEpithelialCells)
  tCells.call(this, numberOfTCells)

  // this.socket.on('epithelialCell', (cells) => {
  //   //CHANGED CELL DATA STORAGE TO OBJECT W/ GLOBAL IDS
  //   const cellData = {}
  //   this.epithelialCells = {}
  //   if (!cells || !cells.length) {
  //     for (let i = 0; i < numberOfEpithelialCells; i++) {
  //       // Since these are the first cells, the client can handle the ID generation, as there will be no conflicts with preexisting cells
  //       let checkingOverlap = true
  //       let randomEpithelialX, randomEpithelialY
  //       while (checkingOverlap) {
  //         console.log('checking overlap of new epi cell...')
  //         randomEpithelialX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
  //         randomEpithelialY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
  //         if (Object.keys(this.epithelialCells).every(id => 
  //         !this.epithelialCells[id].getBounds().contains(randomEpithelialX, randomEpithelialY))) {
  //           console.log('no overlap! wheeoo!')
  //           checkingOverlap = false
  //           }
  //       }
  //       console.log('finalizing coordinates!')
  //       cellData[i] = {x: randomEpithelialX, y: randomEpithelialY, tint: null, globalId: i}
  //       this.epithelialCells[i] = makeEpithelialCell.call(this, cellData[i])
  //     }
  //     //emit new cells
  //     this.socket.emit('newEpithelialCells', cellData)
  //   } else {
  //     // this.epithelialCells = cells.map(cell => makeEpithelialCell.call(this, cell.x, cell.y, cell.tint, cell.globalId))
  //     for (let id in cells) {
  //       this.epithelialCells[id] = makeEpithelialCell.call(this, cells[id])
  //     }
  //   }
  // })

  // this.socket.on('changedEpithelialCellClient', globalId => {
  //   this.epithelialCells[globalId].setTint(0xd60000)
  //   this.badGuys.push(this.epithelialCells[globalId])
  // })

  // this.socket.on('dormantTCell', (cells) => {
  //   this.dormantTCells = {}
  //   if(!Object.keys(cells).length) {
  //     console.log("I WAS CREATED FOR THE FIRST TIME!!!")
  //     // CELL DATA STORAGE IS OBJECT W/ GLOBAL IDS
  //     const cellData = {}
  //     for (let i = 0; i < numberOfTCells; i++) {
  //       const randomTCellX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
  //       const randomTCellY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
  //       const randomVelocityX = Math.floor(Math.random() * 8 - 4)
  //       const randomVelocityY = Math.floor(Math.random() * 8 - 4)
  //       const randomAngularVelocity = Math.random() * 0.5 - 0.25
  //       // Again, since these are the first cells, the client can handle the IDs with no need for server guidance
  //       cellData[i] = {
  //         positionX: randomTCellX, positionY: randomTCellY, 
  //         velocityX: randomVelocityX, velocityY: randomVelocityY, 
  //         angle: 0, angularVelocity: randomAngularVelocity,
  //         randomDirection: {x: 0, y: 0}, globalId: i
  //       }
  //       this.dormantTCells[i] = makeTCell.call(this, cellData[i])
  //     }
  //     this.clientDormantTCells = {...this.dormantTCells} // must make copy b/c otherwise client list will always be identical
  //     this.socket.emit('myNewTCells', cellData)
  //   } else {
  //     console.log("I was not. I was created by someone else who came before you")
  //     for (let id in cells) {
  //       this.dormantTCells[id] = makeTCell.call(this, cells[id])
  //     }
  //     this.clientDormantTCells = {}
  //   }
  // })

  // // Mid-game generation of any new T cells
  // this.socket.on('addDormantTCells', (newCells, ownerId) => {
  //   for (let id in newCells) {
  //     const newCell = makeTCell.call(this, newCells[id])
  //     this.dormantTCells[id] = newCell
  //     // If the server decides that you should be responsible for the new cell(s)
  //     if (ownerId === this.socket.id) this.clientDormantTCells[id] = newCell
  //   }
  // })

  // // When a player disconnects and the server decides you should get responsibility for their cells
  // this.socket.on('passDormantTCells', passedCellIds => { // AN ARRAY
  //   passedCellIds.forEach(id => {if (this.dormantTCells[id]) this.clientDormantTCells[id] = this.dormantTCells[id]})
  //   console.log('passed cells, new total client cells: ', this.clientDormantTCells)
  // })

  // this.socket.on('changedDormantTCells', cellData => {
  //   for (let id in cellData) {
  //     const currCell = this.dormantTCells[id]
  //     setCellParams(currCell, cellData[id])
  //   }
  // })

  this.socket.on('mastCell', cells => {
    this.mastCells = {}
    if (!cells || !Object.keys(cells).length) {
      const cellData = {}
      console.log('creating mast cells for the first time!!!')
      for (let i = 0; i < numberOfMastCells; i++) {
        const positionX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
        const positionY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
        const velocityX = Math.floor(Math.random() * 12 - 6)
        const velocityY = Math.floor(Math.random() * 12 - 6)
        const angularVelocity = Math.random() * 0.3 - 0.15
        cellData[i] = {positionX, positionY, velocityX, velocityY, angularVelocity, globalId: i}
        this.mastCells[i] = makeMastCell.call(this, cellData[i])
      }
      this.socket.emit('newMastCells', cellData)
    } else {
      console.log('copying existing mast cells from server...')
      for (let id in cells) {
        this.mastCells[id] = makeMastCell.call(this, cells[id])
      }
    }
    this.ownsMastCells = true
  })

  this.socket.on('updateMastCellsClient', cells => {
    for (let id in cells) {
      setCellParams.call(this, this.mastCells[id], cells[id])
    }
  })

  this.socket.on('disownMastCells', () => {
    this.ownsMastCells = false
  })
  this.socket.on('passMastCells', () => {
    this.ownsMastCells = true
  })

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
    epithelialCellCollision.call(this, bodyA, bodyB)
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
    this.badGuys.push(this.ship)
  } else {
    this.ship.setTint(0x01c0ff)
    this.goodGuys.push(this.ship)
  }

  this.input.on("pointermove", function(pointer) {
    // VIEWPORT: 800x, 600y
    const adjustedPointerX = limitNumber(pointer.x + this.ship.x - 400, pointer.x, pointer.x + worldSize.x - 800)
    const adjustedPointerY = limitNumber(pointer.y + this.ship.y - 300, pointer.y, pointer.y + worldSize.y - 600)
    var angle = -Math.atan2(adjustedPointerX - this.ship.x, adjustedPointerY - this.ship.y) * 180 / Math.PI;
    this.ship.angle = angle;
  }, this)
}

function addOtherPlayers(playerInfo) {
  const randomX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
  const randomY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
  const otherPlayer = this.matter.add.image(randomX, randomY, 'ship')
  otherPlayer.setScale(0.5);
  otherPlayer.setCircle(otherPlayer.width / 2, shipParams)
  if (playerInfo.team === 'blue') {
    otherPlayer.setTint(0xd60000)
    this.badGuys.push(otherPlayer)
  } else {
    otherPlayer.setTint(0x01c0ff)
    this.goodGuys.push(otherPlayer)
  }
  otherPlayer.playerId = playerInfo.playerId
  this.otherPlayers.push(otherPlayer)
}

// function makeEpithelialCell({ x, y, tint, globalId }) {
//   const cell = this.matter.add.image(x, y, 'epithelialCell')
//   cell.setRectangle(cell.width / 2, cell.height / 2, {
//     isStatic: true,
//     ...defaultCellParams
//   })
//   if (tint === 0xd60000) {
//     cell.setTint(tint)
//     this.badGuys.push(cell)
//   }
//   cell.globalId = globalId
//   return cell
// }

// function makeTCell(cellDatum){
//   const cell = this.matter.add.image(cellDatum.positionX, cellDatum.positionY, 'dormantTCell')
//   cell.setCircle(cell.width / 2, defaultCellParams)
//   setCellParams(cell, cellDatum)
//   // cell.activate = function() {
//   //     this.setVelocity(0, 0) //PLACEHOLDER
//   //     console.log("I'm a good guy now!")
//   //     cell.setTint(0x01c0ff)

//   //     cell.activated = true
//   //   }
//   return cell
// }

function makeMastCell(cellDatum) {
  
  const boundContains = cellContains.bind(this)
  const histamines = this.add.particles('histamines')
  const secretor = histamines.createEmitter({
    x: 1,
    y: 1,
    speed: Math.floor(Math.random() * 150) + 150,
    scale: {
      start: 1,
      end: 0
    },
    blendMode: 'ADD',
    deathZone: {
      type: 'onEnter',
      source: { contains: boundContains }
    }
  })
  const mastCell = this.matter.add.image(cellDatum.positionX, cellDatum.positionY, 'mastCell')
  mastCell.setCircle(mastCell.width / 2, defaultCellParams)
  setCellParams(mastCell, cellDatum)
  secretor.startFollow(mastCell)
  return mastCell
}

function cellContains(x, y) {
  for (let id in this.dormantTCells) {
    const currCell = this.dormantTCells[id]
    if (currCell.getBounds().contains(x, y)) {
      if (!currCell.activated) {
        activate.call(this, currCell)
      }
      return true
    }
  }
  return false
}

// function setCellParams(cell, { positionX, positionY, velocityX, velocityY, angle, angularVelocity, randomDirection, tint, globalId }) {
//   cell.setPosition(positionX, positionY)
//   cell.setVelocity(velocityX, velocityY)
//   // cell.setAngle(angle) // blocks spin transmission for some reason
//   cell.setAngularVelocity(angularVelocity)
//   if(tint && tint !== cell.tintBottomLeft) {
//     cell.setTint(tint)
//     if (tint === 0x01c0ff) this.goodGuys.push(cell)
//     if (tint === 0xd60000) this.badGuys.push(cell)
//   }
//   if (randomDirection) cell.randomDirection = randomDirection
//   cell.globalId = globalId
// }

// function epithelialCellCollision(bodyA, bodyB) {
//   const matchingCellId = Object.keys(this.epithelialCells).find(key => (this.epithelialCells[key].body.id === bodyA.id || this.epithelialCells[key].body.id === bodyB.id))
//   if (this.ship && this.ship.tintBottomLeft === 214 && 
//     this.epithelialCells[matchingCellId] &&
//     (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id)) {
//     this.epithelialCells[matchingCellId].setTint(0xd60000)
//     this.badGuys.push(this.epithelialCells[matchingCellId])
//     this.socket.emit('changedEpithelialCell', matchingCellId)
//   }
// }
