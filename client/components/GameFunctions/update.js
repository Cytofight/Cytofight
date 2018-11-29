import {
  limitSpeed,
  throttle,
  fire,
  updateForce,
  overlapCollision,
  changeShipColorDebug,
  updateSecretColor
} from './util'
import {
  killEpithelialCell,
  damageEpithelialCell,
  resetCells
} from './createFunctions/epithelialCells'
import {damageBadPlayer, killBadPlayer} from './createFunctions/addPlayers'

const throttledUpdateForce = throttle(updateForce, 1800)
const throttledFire = throttle(fire, 200)
const throttledChangeShipColorDebug = throttle(changeShipColorDebug, 500)
let tCellLimiter = 0,
  mastCellLimiter = 0
let redBloodCellsLimiter = 0
let soundLimiter = 0

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
    if (
      (this.input.activePointer.isDown || this.keyFire.isDown) &&
      this.ship.tintBottomLeft === 16760833
    ) {
      throttledFire.call(this)
    }
    // if (this.keyDebug.isDown) {
    // }
    if (this.keyCreateCell.isDown) {
      this.socket.emit('requestNewTCells', [
        {
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
        }
      ])
    }
    // if (this.keyBlue.isDown) {
    //   throttledChangeShipColorDebug.call(this, 0x01c0ff)
    // }
    // if (this.keyRed.isDown) {
    //   throttledChangeShipColorDebug.call(this, 0xd60000)
    // }
    const nameText = this.ship.nameText
    limitSpeed(this.ship, 10)
    const {angle, angularVelocity, velocity, position} = this.ship.body
    const {previous} = this.ship
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
  if (
    this.clientDormantTCells &&
    Object.keys(this.clientDormantTCells).length &&
    !tCellLimiter
  ) {
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
  if (
    this.ownsMastCells &&
    this.mastCells &&
    Object.keys(this.mastCells).length &&
    !mastCellLimiter
  ) {
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

  redBloodCellsLimiter = (redBloodCellsLimiter + 1) % 3
  if (
    this.ownsRedBloodCells &&
    this.redBloodCells &&
    this.redBloodCells.length &&
    !redBloodCellsLimiter
  ) {
    const cellData = {}
    for (let i = 0; i < this.redBloodCells.length; i++) {
      const cell = this.redBloodCells[i]
      limitSpeed(cell, 6)
      cellData[i] = {
        positionX: cell.body.position.x,
        positionY: cell.body.position.y,
        velocityX: cell.body.velocity.x,
        velocityY: cell.body.velocity.y,
        angularVelocity: cell.body.angularVelocity,
        globalId: cell.globalId
      }
    }
    this.socket.emit('updateRedBloodCells', cellData)
  }

  this.antibodies.getChildren().forEach(antibody => {
    for (let id in this.epithelialCells) {
      impact.call(this, antibody, this.epithelialCells[id])
    }
    for (let id in this.mastCells) {
      impact.call(this, antibody, this.mastCells[id])
    }
    for (let id in this.redBloodCells) {
      impact.call(this, antibody, this.redBloodCells[id])
    }
    for (let id in this.dormantTCells) {
      impact.call(this, antibody, this.dormantTCells[id])
    }
    for (let id in this.badGuys.epithelialCells) {
      badGuyCollision.call(this, antibody, this.badGuys.epithelialCells[id])
    }
    for (let id in this.badGuys.players) {
      badGuyCollision.call(this, antibody, this.badGuys.players[id], () =>
        console.log('beep')
      )
    }
  })
  
  soundLimiter = (soundLimiter + 1) % 13
  if (this.badGuys.players[this.socket.id]) {
    const infectionSound = this.sound.add('infectionUnderWay', {
      volume: 0.9
    })
    for (let cellId in this.epithelialCells) {
      if (!this.badGuys.epithelialCells[cellId]) {
        const currCell = this.epithelialCells[cellId]
        if (
          currCell.infectionRange.contains(
            this.ship.body.position.x,
            this.ship.body.position.y
            )
            ) {
          if(!soundLimiter){
            infectionSound.play()
          }
          currCell.infectedness++
          currCell.infectionText.setText(
            `${Math.ceil(currCell.infectedness / 1.8)}%`
          )
          switch (currCell.infectedness) {
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

          //Updates local machine's score and ends game if all the cells are infected

          if (currCell.infectedness >= 180) {
            currCell.setTint(0xd60000)
            this.badGuys.epithelialCells[cellId] = currCell

            this.socket.emit('changedEpithelialCell', cellId, {tint: 0xd60000})
            this.redScoreText.setText(
              'Infected Epithelial Cells: ' +
                Object.keys(this.badGuys.epithelialCells).length
            )
            this.blueScoreText.setText(
              'Healthy Epithelial Cells: ' +
                (Object.keys(this.epithelialCells).length -
                  Object.keys(this.badGuys.epithelialCells).length)
            )
            if (
              Object.keys(this.epithelialCells).length -
                Object.keys(this.badGuys.epithelialCells).length ===
              0
            ) {
              if (this.badGuys.players[this.socket.id]) {
                this.scene.start('Winner')
                resetCells.call(this)
              } else if (this.goodGuys.players[this.socket.id]) {
                this.scene.start('GoodLoser')
                resetCells.call(this)
              }
            }
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
  if (this.ship)
    this.minimap.scrollX = Phaser.Math.Clamp(this.ship.x - 200, 650, 1175)
  if (this.ship)
    this.minimap.scrollY = Phaser.Math.Clamp(this.ship.y - 200, 450, 1450)
}

function impact(antibody, cell) {
  overlapCollision.call(
    this,
    {
      x: antibody.x,
      y: antibody.y
    },
    cell,
    () => {
      antibody.destroy()
    }
  )
}

function badGuyCollision(antibody, badGuy, killFunction) {
  overlapCollision.call(
    this,
    {
      x: antibody.x,
      y: antibody.y
    },
    badGuy,
    () => {
      antibody.destroy()
      if (
        this.secretColor.found ||
        updateSecretColor.call(this, antibody.color)
      ) {
        const newHealth = badGuy.health - antibody.damage
        if (badGuy.globalId) {
          damageEpithelialCell.call(this, newHealth, badGuy)
        } else if (badGuy.playerId) {
          damageBadPlayer.call(this, newHealth, badGuy)
        }
      }
    }
  )
}
