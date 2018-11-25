import { worldSize } from '../util'

export function epithelialCells(amount, params) {
  this.socket.on('epithelialCell', (cells) => {
    const cellData = {}
    this.epithelialCells = {}
    if (!cells || !cells.length) {
      for (let i = 0; i < amount; i++) {
        // Since these are the first cells, the client can handle the ID generation, as there will be no conflicts with preexisting cells
        let checkingOverlap = true
        let randomX, randomY
        while (checkingOverlap) {
          console.log('checking overlap of new epi cell...')
          randomX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
          randomY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
          if (Object.keys(this.epithelialCells).every(id => 
          !this.epithelialCells[id].getBounds().contains(randomX, randomY))) {
            console.log('no overlap! wheeoo!')
            checkingOverlap = false
            }
        }
        console.log('finalizing coordinates!')
        cellData[i] = {x: randomX, y: randomY, tint: null, globalId: i, params}
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
  })

  this.socket.on('changedEpithelialCellClient', globalId => {
    this.epithelialCells[globalId].setTint(0xd60000)
    this.badGuys.push(this.epithelialCells[globalId])
  })
}

export function makeEpithelialCell({ x, y, tint, globalId, params }) {
  const cell = this.matter.add.image(x, y, 'epithelialCell')
  cell.setRectangle(cell.width / 2, cell.height / 2, {
    isStatic: true,
    ...params
  })
  if (tint === 0xd60000) {
    cell.setTint(tint)
    this.badGuys.push(cell)
  }
  cell.globalId = globalId
  return cell
}

export function epithelialCellCollision(bodyA, bodyB) {
  const matchingCellId = Object.keys(this.epithelialCells).find(key => (this.epithelialCells[key].body.id === bodyA.id || this.epithelialCells[key].body.id === bodyB.id))
  if (this.ship && this.ship.tintBottomLeft === 214 && 
    this.epithelialCells[matchingCellId] &&
    (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id)) {
    this.epithelialCells[matchingCellId].setTint(0xd60000)
    this.badGuys.push(this.epithelialCells[matchingCellId])
    this.socket.emit('changedEpithelialCell', matchingCellId)
  }
}