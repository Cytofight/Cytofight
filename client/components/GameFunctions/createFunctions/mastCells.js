import { worldSize, defaultCellParams, setCellParams } from '../util'

export function mastCells(amount) {
  this.socket.on('mastCell', cells => {
    this.mastCells = {}
    if (!cells || !Object.keys(cells).length) {
      const cellData = {}
      for (let i = 0; i < amount; i++) {
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
}

export function makeMastCell(cellDatum) {
  const contains = (x, y) => {
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
  
  const histamines = this.add.particles('histamines')
  const secretor = histamines.createEmitter({
    x: 1, y: 1,
    speed: Math.floor(Math.random() * 150) + 150,
    scale: {start: 1, end: 0},
    blendMode: 'ADD',
    deathZone: {
      type: 'onEnter',
      source: { contains }
    }
  })
  
  const mastCell = this.matter.add.image(cellDatum.positionX, cellDatum.positionY, 'mastCell')
  mastCell.setCircle(mastCell.width / 2, defaultCellParams)
  setCellParams(mastCell, cellDatum)
  secretor.startFollow(mastCell)
  return mastCell
}

export function activate(cell) {
  cell.setVelocity(0, 0) //PLACEHOLDER
  cell.setTint(0x01c0ff)
  this.goodGuys.push(cell)
  cell.activated = true
}