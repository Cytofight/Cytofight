import {
  worldSize,
  defaultCellParams,
  setCellParams
} from '../util'

export function redBloodCells(amount) {
  this.socket.on('redBloodCells', (cells) => {
    this.redBloodCells = []
    if (!cells.length) {
      // CELL DATA STORAGE IS OBJECT W/ GLOBAL IDS
      const cellData = {}
      for (let i = 0; i < amount; i++) {
        const randomPositionX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
        const randomPositionY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
        const randomVelocityX = Math.floor(Math.random() * 5 - 2.5)
        const randomVelocityY = Math.floor(Math.random() * 5 - 2.5)
        const randomAngularVelocity = Math.random() * 0.5 - 0.25
        // Since these are the first cells, the client can handle the IDs with no need for server guidance
        cellData[i] = {
          positionX: randomPositionX,
          positionY: randomPositionY,
          velocityX: randomVelocityX,
          velocityY: randomVelocityY,
          angle: 0,
          angularVelocity: randomAngularVelocity,
          randomDirection: {
            x: 0,
            y: 0
          }
        }
        this.redBloodCells.push(makeRedBloodCell.call(this, cellData[i]))
      }
      this.socket.emit('newRedBloodCells', cellData)
    } else {
      for (let id in cells) {
        this.redBloodCells.push(makeRedBloodCell.call(this, cells[id]))
      }
    }
  })

  this.socket.on('updateRedBloodCellsClient', cells => {
    for (let id in cells) {
      setCellParams.call(this, this.redBloodCells[id], cells[id])
    }
  })
}

export function makeRedBloodCell(cellDatum) {
  const cell = this.matter.add.image(cellDatum.positionX, cellDatum.positionY, 'redBloodCell', ).setScale(.2)
  cell.setCircle(cell.width / 16, defaultCellParams)
  setCellParams(cell, cellDatum)
  return cell
}
