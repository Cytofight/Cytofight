import {
  worldSize,
  defaultCellParams,
  setCellParams
} from '../util'

export function infectedCells(amount) {
  this.socket.on('infectedCells', (cells) => {
    this.badGuys.infectedCells = {}
    if(!Object.keys(cells).length) {
      console.log('there is nothign here')
    } else {
      for (let id in cells) {
        console.log(cells[id])
        this.badGuys.infectedCells[id] = makeInfectedCell.call(this, cells[id])
        console.log(this.badGuys.infectedCells[id].randomDirection)
      }
    }
    this.clientInfectedCells = {}
  })

  this.socket.on('newInfectedCellClient', (cellDatum) => {
      const newCell = makeInfectedCell.call(this, cellDatum)
      this.badGuys.infectedCells[newCell.globalId] = newCell
      // If the server decides that you should be responsible for the new cell(s)
      // if (ownerId === this.socket.id) this.clientInfectedCells[newCell.globalId] = newCell //WILL NEVER HAPPEN
  })

  // When a player disconnects and the server decides you should get responsibility for their cells
  this.socket.on('passInfectedCells', passedCellIds => { // AN ARRAY
    passedCellIds.forEach(id => {
      if (this.badGuys.infectedCells[id]) this.clientInfectedCells[id] = this.badGuys.infectedCells[id]
    })
  })

  this.socket.on('changedInfectedCellsClient', cellData => {
    const ids = Object.keys(cellData)
    ids.forEach(id => {
      setCellParams(this.badGuys.infectedCells[id], cellData[id])
      // if (cellData[id].tint) this.goodGuys.tCells[id] = this.dormantTCells[id]
    })
  })
}

export function makeInfectedCell({positionX, positionY, velocityX, velocityY, angle, angularVelocity, randomDirection, globalId, health}) {
  const cell = this.matter.add.image(positionX, positionY, 'ship')
  cell.setCircle(cell.width / 3, defaultCellParams)
  cell.setScale(0.5)
  cell.setTint(0xd60000)
  // cell.angle = angle
  cell.setVelocity(velocityX, velocityY)
  cell.setAngularVelocity(angularVelocity)
  cell.randomDirection = randomDirection || {x: 0, y: 0}
  cell.globalId = globalId
  cell.health = health || 200
  this.badGuys.infectedCells[globalId] = cell
  return cell
}

export function spawnInfectedCell(x, y) {
  const randomAngularVelocity = Math.random() * 0.4 - 0.2
  // Since these are the first cells, the client can handle the IDs with no need for server guidance
  let biggestId = Math.max(...Object.keys(this.badGuys.infectedCells))
  if (biggestId < 0) biggestId = -1
  const globalId = biggestId + 1
  const cellData = {
    positionX: x, positionY: y, 
    velocityX: 0, velocityY: 0, 
    angle: 0, angularVelocity: randomAngularVelocity,
    randomDirection: {x: 0, y: 0}, globalId,
    health: 200
  }
  const cell = makeInfectedCell.call(this, cellData)
  this.clientInfectedCells[globalId] = cell
  this.socket.emit('newInfectedCell', cellData)
}

export function killInfectedCell(globalId) {
  this.epithelialCells[globalId].destroy()
  if (this.clientInfectedCells[globalId]) delete this.clientInfectedCells[globalId]
  delete this.badGuys.infectedCells[globalId]
  // this.redScoreText.setText('Infected Epithelial Cells: ' + Object.keys(this.badGuys.epithelialCells).length)
  this.socket.emit('deleteInfectedCell', globalId)
}

export function damageInfectedCell(newHealth, cell) {
  cell.health = newHealth
  if (cell.health <= 0) killInfectedCell.call(this, cell.globalId)
}
