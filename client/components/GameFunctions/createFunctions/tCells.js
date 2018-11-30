import { worldSize, defaultCellParams, setCellParams } from '../util'

export function tCells(amount) {
  this.socket.on('dormantTCell', (cells) => {
    this.dormantTCells = {}
    if(!Object.keys(cells).length) {
      // CELL DATA STORAGE IS OBJECT W/ GLOBAL IDS
      const cellData = {}
      for (let i = 0; i < amount; i++) {
        const randomPositionX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
        const randomPositionY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
        const randomVelocityX = Math.floor(Math.random() * 8 - 4)
        const randomVelocityY = Math.floor(Math.random() * 8 - 4)
        const randomAngularVelocity = Math.random() * 0.5 - 0.25
        // Since these are the first cells, the client can handle the IDs with no need for server guidance
        cellData[i] = {
          positionX: randomPositionX, positionY: randomPositionY, 
          velocityX: randomVelocityX, velocityY: randomVelocityY, 
          angle: 0, angularVelocity: randomAngularVelocity,
          randomDirection: {x: 0, y: 0}, globalId: i
        }
        this.dormantTCells[i] = makeTCell.call(this, cellData[i])
      }
      this.clientDormantTCells = {...this.dormantTCells} // must make copy b/c otherwise client list will always be identical
      this.socket.emit('myNewTCells', cellData)
    } else {
      for (let id in cells) {
        this.dormantTCells[id] = makeTCell.call(this, cells[id])
      }
      this.clientDormantTCells = {}
    }
  })

  // Mid-game generation of any new T cells
  this.socket.on('addDormantTCells', (newCells, ownerId) => {
    for (let id in newCells) {
      const newCell = makeTCell.call(this, newCells[id])
      this.dormantTCells[id] = newCell
      // If the server decides that you should be responsible for the new cell(s)
      if (ownerId === this.socket.id) this.clientDormantTCells[id] = newCell
    }
  })

  // When a player disconnects and the server decides you should get responsibility for their cells
  this.socket.on('passDormantTCells', passedCellIds => { // AN ARRAY
    passedCellIds.forEach(id => {
      if (this.dormantTCells[id]) this.clientDormantTCells[id] = this.dormantTCells[id]
    })
  })

  this.socket.on('changedDormantTCells', cellData => {
    for (let id in cellData) {
      setCellParams(this.dormantTCells[id], cellData[id])
      if (cellData[id].tint) this.goodGuys.tCells[id] = this.dormantTCells[id]
    }
  })
}

export function makeTCell(cellDatum) {
  const cell = this.matter.add.image(cellDatum.positionX, cellDatum.positionY, 'dormantTCell')
  cell.setCircle(cell.width / 2, {label: 'tCell', ...defaultCellParams})
  setCellParams(cell, cellDatum)
  cell.followRadius = new Phaser.Geom.Circle(cellDatum.positionX, cellDatum.positionY, 300)
  cell.damageRadius = new Phaser.Geom.Circle(cellDatum.positionX, cellDatum.positionY, 220)
  return cell
}

export function followBadGuy(tCell, badGuyPosition) {
  const angle =
        // -Math.atan2(
        //   tCell.body.position.x - badGuy.body.position.x,
        //   tCell.body.position.x - badGuy.body.position.x
        // ) *
        // 180 /
        // Math.PI
        Phaser.Math.Angle.BetweenPoints(tCell.body.position, badGuyPosition)
  const accel = 0.005
  const angleSign = angle < 0 ? -1 : 1
  const y = accel * Math.sin(angle)
  // const x = Math.sqrt(Math.pow(accel, 2) - Math.pow(y, 2))
  const x = accel * Math.cos(angle)
  tCell.randomDirection = {x, y}
}