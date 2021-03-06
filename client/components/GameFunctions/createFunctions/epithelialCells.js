import {worldSize, defaultCellParams, resetCells} from '../util'
import {spawnInfectedCell} from './index'

export function epithelialCells(amount) {
  this.socket.on('epithelialCell', cells => {
    const cellData = {}
    this.epithelialCells = {}
    this.clientSpawningCells = {}
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
        cellData[i] = {
          x: randomX,
          y: randomY,
          tint: null,
          globalId: i,
          health: 200
        }
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

  this.socket.on('changedEpithelialCellClient', (globalId, params) => {
    const currCell = this.epithelialCells[globalId]
    if (params.tint && !this.badGuys.epithelialCells[globalId]) {
      currCell.setTint(params.tint)
      this.badGuys.epithelialCells[globalId] = currCell
      this.blueScoreText.setText(
        'Healthy Epithelial Cells: ' +
          (Object.keys(this.epithelialCells).length -
            Object.keys(this.badGuys.epithelialCells).length)
      )
      this.redScoreText.setText(
        'Infected Epithelial Cells: ' +
          Object.keys(this.badGuys.epithelialCells).length
      )
    }
    if (params.health && currCell) {
      damageEpithelialCell(currCell.health, currCell)
    }
    if (
      Object.keys(this.badGuys.epithelialCells).length ===
      Object.keys(this.epithelialCells).length
    )
      if (this.badGuys.players[this.socket.id]) {
        resetCells.call(this)
        this.scene.start('Winner')
      } else if (this.goodGuys.players[this.socket.id]) {
      resetCells.call(this)
      this.scene.start('GoodLoser')
    }
    if (params.spawning) {
      currCell.spawn = setInterval(() => spawnInfectedCell(currCell.body.position.x, currCell.body.position.y), 10000)
    }
  })

  this.socket.on('passSpawningRedEpithelialCells', ids => {
    console.log('about to pass ids: ', ids)
    ids.forEach(id => {
      const currCell = this.epithelialCells[id]
      currCell.spawn = setInterval(() => spawnInfectedCell.call(this, currCell.body.position.x, currCell.body.position.y), 10000)
    })
  })

  this.socket.on('hugeBoi', () => {
    const hugeBoi = this.matter.add.image(1000, 1000, 'epithelialCell')
      .setScale(15)
    hugeBoi.setRectangle(hugeBoi.width / 2, hugeBoi.height / 2, defaultCellParams)
      .setTint(0xd60000)
      hugeBoi.spawn = setInterval(() => {
        spawnInfectedCell.call(this, hugeBoi.body.position.x, hugeBoi.body.position.y)
      }, 250)
    hugeBoi.health = 5000
    this.epithelialCells[9999] = hugeBoi
    this.badGuys.epithelialCells = hugeBoi
  })

  this.socket.on('deletedEpithelialCell', globalId => {
    if (this.epithelialCells[globalId]) this.epithelialCells[globalId].destroy()
    delete this.epithelialCells[globalId]
    delete this.badGuys.epithelialCells[globalId]
  })
}

export function makeEpithelialCell({x, y, tint, globalId, health}) {
  const cell = this.matter.add.image(x, y, 'epithelialCell').setScale(1.8)
  cell.setRectangle(cell.width + 5, cell.height + 30, {
    isStatic: true,
    ...defaultCellParams
  })
  if (tint === 0xd60000) {
    cell.setTint(tint)
    this.badGuys.epithelialCells[globalId] = cell
  }
  cell.infectionRange = new Phaser.Geom.Circle(x, y, 140)
  cell.infectedness = 0
  cell.infectionText = this.add
    .text(x - 13, y, '', {fontSize: '14px', fill: '#ffffff'})
    .setStroke('#000000', 2)
  cell.infectionText.fontWeight = 'bold'
  cell.globalId = globalId
  cell.health = health
  return cell
}

export function epithelialCellContains(x, y, cell) {
  if (cell.infectionRange.contains(x, y)) console.log('beep')
}

// *******DO NOT USE********
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
    console.log('done!')
    this.epithelialCells[matchingCellId].setTint(0xd60000)
    this.epithelialCells[matchingCellId].spawn = setInterval(() => {
      spawnInfectedCell(this.epithelialCells[matchingCellId].body.position.x, this.epithelialCells[matchingCellId].body.position.y)}, 10000
    )
    this.badGuys.epithelialCells[matchingCellId] = this.epithelialCells[matchingCellId]
    this.blueScoreText.setText('Healthy Epithelial Cells: ' + (Object.keys(this.epithelialCells).length - Object.keys(this.badGuys.epithelialCells).length))
    this.redScoreText.setText('Infected Epithelial Cells: ' + Object.keys(this.badGuys.epithelialCells).length)
    this.socket.emit('changedEpithelialCell', matchingCellId, {tint: 0xd60000})
    if (
      Object.keys(this.badGuys.epithelialCells).length ===
        Object.keys(this.epithelialCells).length &&
      this.badGuys.players[this.socket.id]
    ) {
      resetCells.call(this)
      this.scene.start('Winner')
    }
  }
}

export function killEpithelialCell(globalId) {
  // const destroyedSound = this.sound.add('smallexplosion', {volume: 0.5})
  this.destroyedSound.play()
  if (this.epithelialCells[globalId]) {
    this.epithelialCells[globalId].destroy()
    delete this.epithelialCells[globalId]
    delete this.badGuys.epithelialCells[globalId]
    this.redScoreText.setText(
      'Infected Epithelial Cells: ' +
        Object.keys(this.badGuys.epithelialCells).length
    )
    this.socket.emit('deleteEpithelialCell', globalId)
  }
}

export function damageEpithelialCell(newHealth, cell) {
  // const damagedSound = this.sound.add('hitCell', {
  //   volume: 0.5
  // })
  cell.setTint(0xffff33)
  setTimeout(() => cell.setTint(0xd60000), 100)
  this.damagedSound.play()
  cell.health = newHealth
  if (cell.health <= 0) killEpithelialCell.call(this, cell.globalId)
}
