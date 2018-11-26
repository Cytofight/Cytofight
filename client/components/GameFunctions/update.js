import { NPCCells } from './createFunctions';
import { limitSpeed, throttle, fire, updateForce, overlapCollision } from './util'

const throttledUpdateForce = throttle(updateForce, 1800)
const throttledFire = throttle(fire, 200)
let tCellLimiter = 0, mastCellLimiter = 0

export function update(time) {
  //  And this camera is 400px wide, so -200
  this.minimap.scrollX = Phaser.Math.Clamp(this.ship.x - 200, 650, 1175);
  this.minimap.scrollY = Phaser.Math.Clamp(this.ship.y - 200, 450, 1450);

  // const boundFire = throttledFire.bind(this)
  const changeShipColorDebug = throttle((tint) => {
    let prevAlignment, nextAlignment
    this.ship.setTint(tint)
    if (tint === 0x01c0ff) {
      prevAlignment = this.badGuys
      nextAlignment = this.goodGuys
    } else if (tint === 0xd60000) {
      prevAlignment = this.goodGuys
      nextAlignment = this.badGuys
    }
    const currIndex = prevAlignment.indexOf(this.ship)
    if (currIndex !== -1) prevAlignment.splice(currIndex, 1)
    nextAlignment.push(this.ship)
  }, 500)

  if (this.ship) {
    if (this.cursors.left.isDown || this.keyLeft.isDown) {
      this.ship.applyForce({x: -0.005, y: 0})
      limitSpeed(this.ship, 8)
    } if (this.cursors.right.isDown || this.keyRight.isDown) {
      this.ship.applyForce({x: 0.005, y: 0})
      limitSpeed(this.ship, 8)
    } if (this.cursors.up.isDown || this.keyUp.isDown) {
      this.ship.applyForce({x: 0, y: -0.005})
      limitSpeed(this.ship, 8)
    } if (this.cursors.down.isDown || this.keyDown.isDown) {
      this.ship.applyForce({x: 0, y: 0.005})
      limitSpeed(this.ship, 8)
    } 
    if ((this.input.activePointer.isDown || this.keyFire.isDown) && this.ship.tintBottomLeft === 16760833) {
      const firingInfo = {
        x: this.ship.body.position.x,
        y: this.ship.body.position.y,
        angle: this.ship.body.angle,
        globalId: this.socket.id,
        type: 'ship'
      }
      throttledFire.call(this, firingInfo)
      this.socket.emit('firedAntibody', firingInfo)
    }
    if (this.keyCreateCell.isDown) {
      this.socket.emit('requestNewTCells', [{
        positionX: this.ship.body.position.x, positionY: this.ship.body.position.y, 
        velocityX: 0, velocityY: 0, 
        angle: 0, angularVelocity: 1, 
        randomDirection: {x: 0, y: 0}}])
    } if (this.keyBlue.isDown) {
      changeShipColorDebug(0x01c0ff)
    } if (this.keyRed.isDown) {
      changeShipColorDebug(0xd60000) 
    }
    
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
        position
      })
    }

    this.ship.previous = {
      velocity,
      angularVelocity
    }
  }

  tCellLimiter = (tCellLimiter + 1) % 3
  if (this.clientDormantTCells && Object.keys(this.clientDormantTCells).length && !tCellLimiter){
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
    this.badGuys.forEach(badGuy => {
      overlapCollision.call(this, {x: antibody.x, y: antibody.y}, badGuy, () => {
        antibody.destroy()
      })
    })
  })
}