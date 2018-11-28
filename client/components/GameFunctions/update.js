import {
  limitSpeed,
  throttle,
  fire,
  updateForce,
  overlapCollision,
  changeShipColorDebug,
  updateSecretColor
} from './util'
import { killEpithelialCell, damageEpithelialCell } from './createFunctions/epithelialCells';

const throttledUpdateForce = throttle(updateForce, 1800)
const throttledFire = throttle(fire, 200)
const throttledChangeShipColorDebug = throttle(changeShipColorDebug, 500)
let tCellLimiter = 0,
  mastCellLimiter = 0

export function update(time) {

  // const boundFire = throttledFire.bind(this)

  if (this.ship) {
    // display name over your
    this.ship.nameText.x = this.ship.body.position.x - 125
    this.ship.nameText.y = this.ship.body.position.y - 50

    if (this.cursors.left.isDown || this.keyLeft.isDown) {
      this.ship.applyForce({
        x: -0.005,
        y: 0
      })
      limitSpeed(this.ship, 8)
    }
    if (this.cursors.right.isDown || this.keyRight.isDown) {
      this.ship.applyForce({
        x: 0.005,
        y: 0
      })
      limitSpeed(this.ship, 8)
    }
    if (this.cursors.up.isDown || this.keyUp.isDown) {
      this.ship.applyForce({
        x: 0,
        y: -0.005
      })
      limitSpeed(this.ship, 8)
    }
    if (this.cursors.down.isDown || this.keyDown.isDown) {
      this.ship.applyForce({
        x: 0,
        y: 0.005
      })
      limitSpeed(this.ship, 8)
    }
    if ((this.input.activePointer.isDown || this.keyFire.isDown) && this.ship.tintBottomLeft === 16760833) {
      throttledFire.call(this)
      
    }
    if (this.keyCreateCell.isDown) {
      this.socket.emit('requestNewTCells', [{
        positionX: this.ship.body.position.x,
        positionY: this.ship.body.position.y,
        velocityX: 0,
        velocityY: 0,
        angle: 0,
        angularVelocity: 1,
        randomDirection: {
          x: 0,
          y: 0
        }
      }])
    }
    // if (this.keyBlue.isDown) {
    //   throttledChangeShipColorDebug.call(this, 0x01c0ff)
    // }
    // if (this.keyRed.isDown) {
    //   throttledChangeShipColorDebug.call(this, 0xd60000)
    // }
    const nameText = this.ship.nameText
    limitSpeed(this.ship, 10)
    const {
      angle,
      angularVelocity,
      velocity,
      position
    } = this.ship.body
    const {
      previous
    } = this.ship
    if (
      previous &&
      (previous.angle !== angle ||
        previous.angularVelocity !== angularVelocity ||
        previous.velocity.x !== velocity.x ||
        previous.velocity.y !== velocity.y ||
        previous.position.x !== position.x ||
        previous.position.y !== position.y)
    ) {
      this.socket.emit('playerMovement', {
        angle,
        velocity,
        angularVelocity,
        position,
        nameText
      })
    }

    this.ship.previous = {
      velocity,
      angularVelocity
    }
  }


  tCellLimiter = (tCellLimiter + 1) % 3
  if (this.clientDormantTCells && Object.keys(this.clientDormantTCells).length && !tCellLimiter) {

    throttledUpdateForce.call(this, this.clientDormantTCells)
    const cellData = {}
    for (let id in this.dormantTCells) {
      const cell = this.dormantTCells[id]
      cell.applyForce(cell.randomDirection)
      limitSpeed(cell, 4)
      if (this.clientDormantTCells[id]) {
        cellData[id] = {
          positionX: cell.body.position.x,
          positionY: cell.body.position.y,
          velocityX: cell.body.velocity.x,
          velocityY: cell.body.velocity.y,
          angle: cell.body.angle,
          angularVelocity: cell.body.angularVelocity,
          randomDirection: cell.randomDirection,
          globalId: cell.globalId
        }
        if (cell.tintBottomLeft === 0x01c0ff) cellData[id].tint = 0x01c0ff
      }
    }
    this.socket.emit('changedTCells', cellData)
  }

  mastCellLimiter = (mastCellLimiter + 1) % 7
  if (this.ownsMastCells && this.mastCells && Object.keys(this.mastCells).length && !mastCellLimiter) {
    const cellData = {}
    for (let id in this.mastCells) {
      const cell = this.mastCells[id]
      cellData[id] = {
        positionX: cell.body.position.x,
        positionY: cell.body.position.y,
        velocityX: cell.body.velocity.x,
        velocityY: cell.body.velocity.y,
        angularVelocity: cell.body.angularVelocity,
        globalId: cell.globalId
      }
    }
    this.socket.emit('updateMastCells', cellData)
  }

  this.antibodies.getChildren().forEach(antibody => {
    for (let id in this.badGuys.epithelialCells) {
      badGuyCollision.call(this, antibody, this.badGuys.epithelialCells[id], killEpithelialCell)
    }
    for (let id in this.badGuys.players) {
      badGuyCollision.call(this, antibody, this.badGuys.players[id], () => console.log('beep'))
    }
  })

  if (this.badGuys.players[this.socket.id]) {
    for (let cellId in this.epithelialCells) {
      if (!this.badGuys.epithelialCells[cellId]) {
        const currCell = this.epithelialCells[cellId]
        if (currCell.infectionRange.contains(this.ship.body.position.x, this.ship.body.position.y)) {
          currCell.infectedness++
          currCell.infectionText.setText(`${Math.ceil(currCell.infectedness / 1.8)}%`)
          switch(currCell.infectedness) {
            case 1:
              currCell.tintTopLeft = 0xd60000
              break
            case 60:
              currCell.tintTopRight = 0xd60000
              break
            case 120:
              currCell.tintBottomLeft = 0xd60000
              break
          }
          if (currCell.infectedness >= 180) {
            currCell.setTint(0xd60000)
            this.badGuys.epithelialCells[cellId] = currCell
            this.socket.emit('changedEpithelialCell', cellId, {tint: 0xd60000})
            currCell.infectionText.destroy()
          }
        } else if (currCell.infectedness) {
          // clearTimeout(currCell.timer)
          // currCell.timer = null
          currCell.infectedness = 0
          currCell.infectionText.setText('')
          currCell.setTint(0xffffff)
        }
      }
    }
  }
  //  And this camera is 400px wide, so -200
  if (this.ship) this.minimap.scrollX = Phaser.Math.Clamp(this.ship.x - 200, 650, 1175);
  if (this.ship) this.minimap.scrollY = Phaser.Math.Clamp(this.ship.y - 200, 450, 1450);
}

function badGuyCollision(antibody, badGuy, killFunction) {
  overlapCollision.call(this, {
    x: antibody.x,
    y: antibody.y
  }, badGuy, () => {
  if (this.secretColor.found || updateSecretColor.call(this, antibody.color)) {
      const newHealth = badGuy.health - antibody.damage
      damageEpithelialCell.call(this, newHealth, badGuy)
      antibody.destroy()
    }
  })
}