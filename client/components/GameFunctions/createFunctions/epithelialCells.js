import {worldSize, defaultCellParams} from '../util'

export function epithelialCells(amount) {
  this.socket.on('epithelialCell', cells => {
    const cellData = {}
    this.epithelialCells = {}
    if (!cells || !cells.length) {
      for (let i = 0; i < amount; i++) {
        // Since these are the first cells, the client can handle the ID generation, as there will be no conflicts with preexisting cells
        let checkingOverlap = true
        let randomX, randomY
        while (checkingOverlap) {
          randomX = Math.floor(Math.random() * (worldSize.x - 100)) + 50
          randomY = Math.floor(Math.random() * (worldSize.y - 100)) + 50
          if (
            Object.keys(this.epithelialCells).every(
              id =>
                !this.epithelialCells[id].getBounds().contains(randomX, randomY)
            )
          ) {
            checkingOverlap = false
          }
        }
        cellData[i] = {x: randomX, y: randomY, tint: null, globalId: i, health: 200}
        this.epithelialCells[i] = makeEpithelialCell.call(this, cellData[i])
      }
      //emit new cells
      this.socket.emit('newEpithelialCells', cellData)
    } else {
      // this.epithelialCells = cells.map(cell => makeEpithelialCell.call(this, cell.x, cell.y, cell.tint, cell.globalId))
      for (let id in cells) {
        this.epithelialCells[id] = makeEpithelialCell.call(this, cells[id])
        if (this.epithelialCells[id].tintBottomLeft === 0xd60000) {
        }
      }
    }
  })

  this.socket.on('changedEpithelialCellClient', (globalId, params) => {
    const currCell = this.epithelialCells[globalId]
    if (params.tint && !this.badGuys.epithelialCells[globalId]) {
      currCell.setTint(params.tint)
      this.badGuys.epithelialCells[globalId] = currCell
    }
    if (params.health) {
      damageEpithelialCell(currCell.health)
    }
  })

  this.socket.on('deletedEpithelialCell', globalId => {
    this.epithelialCells[globalId].destroy()
    delete this.epithelialCells[globalId]
    delete this.badGuys.epithelialCells[globalId]
  })
}

export function makeEpithelialCell({x, y, tint, globalId, health}) {
  const cell = this.matter.add.image(x, y, 'epithelialCell')
  cell.setRectangle(cell.width / 2, cell.height / 2, {
    isStatic: true,
    ...defaultCellParams
  })
  if (tint === 0xd60000) {
    cell.setTint(tint)
    this.badGuys.epithelialCells[globalId] = cell
  }
  cell.infectionRange = new Phaser.Geom.Circle(x, y, 80)
  cell.globalId = globalId
  cell.health = health
  return cell
}

export function epithelialCellContains(x, y, cell) {
  if (cell.infectionRange.contains(x, y)) console.log('beep')
}

export function epithelialCellCollision(bodyA, bodyB) {
  const matchingCellId = Object.keys(this.epithelialCells).find(
    key =>
      this.epithelialCells[key].body.id === bodyA.id ||
      this.epithelialCells[key].body.id === bodyB.id
  )
  if (
    this.ship &&
    this.ship.tintBottomLeft === 214 &&
    this.epithelialCells[matchingCellId] &&
    (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id) &&
    !this.badGuys.epithelialCells[matchingCellId]
  ) {
    this.epithelialCells[matchingCellId].setTint(0xd60000)
    this.badGuys.epithelialCells[matchingCellId] = this.epithelialCells[matchingCellId]
    this.socket.emit('changedEpithelialCell', matchingCellId, {tint: 0xd60000})
  }
}

export function killEpithelialCell(globalId) {
  this.epithelialCells[globalId].destroy()
  delete this.epithelialCells[globalId]
  delete this.badGuys.epithelialCells[globalId]
  // this.socket.emit('deleteEpithelialCell')
}

export function damageEpithelialCell(cell) {
  cell.health -= damage
  if (cell.health <= 0) killEpithelialCell(cell.globalId)
}