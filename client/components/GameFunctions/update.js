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
import { damageBadPlayer, killBadPlayer } from './createFunctions/addPlayers'
import { killInfectedCell, damageInfectedCell, makeInfectedCell, spawnInfectedCell } from './createFunctions/npcInfectedCell'
import { followBadGuy } from './createFunctions/tCells';

// let temp = 0
const throttledConsoleLog = throttle(console.log, 2000)
const throttledUpdateTCellForce = throttle(updateForce, 1800)
const throttledUpdateInfectedCellForce = throttle(updateForce, 1800)
const throttledFire = throttle(fire, 200)
// const throttledChangeShipColorDebug = throttle(changeShipColorDebug, 500)
let tCellLimiter = 0,
  mastCellLimiter = 0,
  infectedCellLimiter = 1,
  redBloodCellsLimiter = 0,
  tCellDamageLimiter = 0

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
    }
    if (this.cursors.right.isDown || this.keyRight.isDown) {
      this.ship.applyForce({
        x: 0.005,
        y: 0
      })
    }
    if (this.cursors.up.isDown || this.keyUp.isDown) {
      this.ship.applyForce({
        x: 0,
        y: -0.005
      })
    }
    if (this.cursors.down.isDown || this.keyDown.isDown) {
      this.ship.applyForce({
        x: 0,
        y: 0.005
      })
    }
    if (
      (this.input.activePointer.isDown || this.keyFire.isDown) &&
      this.ship.tintBottomLeft === 16760833
    ) {
      throttledFire.call(this)
      
    }
    if (this.keyDebug.isDown) {
      // const cellData = {positionX: randomPositionX, positionY: randomPositionY, 
      //   velocityX: randomVelocityX, velocityY: randomVelocityY, 
      //   angle: 0, angularVelocity: randomAngularVelocity,
      //   randomDirection: {x: 0, y: 0}, globalId: i}
      // makeInfectedCell.call(this, {x: this.ship.body.position.x, y: this.ship.body.position.y, globalId: temp, health: 100} )
      // console.log(this.badGuys.infectedCells[temp])
      // temp++
      // this.socket.emit('newInfectedCell', this.badGuys.infectedCells[temp])
      // console.log(this.clientInfectedCells)
      spawnInfectedCell.call(this, this.ship.body.position.x, this.ship.body.position.y)
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
    limitSpeed(this.ship, 8)
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
      position,
      velocity,
      angularVelocity
    }
  }

  tCellLimiter = (tCellLimiter + 1) % 3
  if (this.clientDormantTCells && Object.keys(this.clientDormantTCells).length && !tCellLimiter) {
    throttledUpdateTCellForce.call(this, this.clientDormantTCells)
    const cellData = {}
    for (let id in this.dormantTCells) {
      const cell = this.dormantTCells[id]
      if (cell.following) followBadGuy(cell, cell.following.body.position)
      cell.applyForce(cell.randomDirection)
      limitSpeed(cell, 3)
      if (this.clientDormantTCells[id]) {
        cellData[id] = {
          positionX: cell.body.position.x,
          positionY: cell.body.position.y,
          velocityX: cell.body.velocity.x,
          velocityY: cell.body.velocity.y,
          angle: cell.body.angle,
          angularVelocity: cell.body.angularVelocity,
          randomDirection: cell.randomDirection,
          globalId: cell.globalId,
        }
        if (cell.tintBottomLeft === 16760833 || cell.tintBottomLeft === 0x01c0ff) cellData[id].tint = 0x01c0ff
        if (cell.following) {
          // console.log('following')
          const cellPosition = cell.body.position
          const enemyPosition = cell.following.body.position
          const distance = Math.sqrt(Math.pow(cellPosition.x - enemyPosition.x, 2) + Math.pow(cellPosition.y - enemyPosition.y, 2))
          if (distance > cell.followRadius.width + 200) {
            delete cell.following
          } else {
            if (!tCellDamageLimiter) {
              console.log('damage before: ', cell.following.health, cell.following)
              if (this.badGuys.infectedCells[cell.following.globalId] === cell.following) damageInfectedCell(1, cell.following)
              else if (this.badGuys.players[cell.following.playerId] || this.badGuys.players[this.socket.id]) {
                console.log('player!')
                damageBadPlayer(cell.following.health - 1, cell.following)
              }
              console.log('damage after: ', cell.following.health)
            }
            tCellDamageLimiter = (tCellDamageLimiter + 1) % 20
          }
        }
        for (let id in this.badGuys.players) {
          const badPlayer = this.badGuys.players[id]
          if (cell.followRadius.contains(badPlayer.body.position.x, badPlayer.body.position.y) && 
          (cell.tintBottomLeft === 16760833 || cell.tintBottomLeft === 0x01c0ff) && 
          !cell.following) {
            console.log('start follow')
            cell.following = badPlayer
          }
        }
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
      limitSpeed(this.mastCells[id], 7)
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

  infectedCellLimiter = (infectedCellLimiter + 1) % 3
  if (this.clientInfectedCells && Object.keys(this.clientInfectedCells).length && !infectedCellLimiter) {
    throttledUpdateInfectedCellForce.call(this, this.clientInfectedCells)
    const cellData = {}
    for (let id in this.badGuys.infectedCells) {
      const cell = this.badGuys.infectedCells[id]
      cell.applyForce(cell.randomDirection)
      limitSpeed(cell, 3)
      if (this.clientInfectedCells[id]) {
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
      }
    }
    this.socket.emit('changedInfectedCells', cellData)
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
      badGuyCollision.call(this, antibody, this.badGuys.epithelialCells[id], damageEpithelialCell)
    }
    for (let id in this.badGuys.players) {
      badGuyCollision.call(this, antibody, this.badGuys.players[id], damageBadPlayer)
    }
    for (let id in this.badGuys.infectedCells) {
      badGuyCollision.call(this, antibody, this.badGuys.infectedCells[id], damageInfectedCell)
    }
  })

  window.hack = 'securitronAndCone'

  if (this.badGuys.players[this.socket.id]) {
    for (let cellId in this.epithelialCells) {
      if (!this.badGuys.epithelialCells[cellId]) {
        const currCell = this.epithelialCells[cellId]
        if (
          currCell && 
          currCell.infectionRange.contains(
            this.ship.body.position.x,
            this.ship.body.position.y
          )
        ) {
          currCell.infectedness++
          currCell.infectionText.setText(
            `${Math.ceil(currCell.infectedness / 1.5)}%`
          )
          switch (currCell.infectedness) {
            case 1:
              currCell.tintTopLeft = 0xd60000
              break
            case 50:
              currCell.tintTopRight = 0xd60000
              break
            case 100:
              currCell.tintBottomLeft = 0xd60000
              break
          }

          //Updates local machine's score and ends game if all the cells are infected

          if (currCell.infectedness >= 150) {
            currCell.setTint(0xd60000)
            this.badGuys.epithelialCells[cellId] = currCell
            currCell.spawn = setInterval(() => {
              spawnInfectedCell.call(this, currCell.body.position.x, currCell.body.position.y)
            }, 10000)
            this.clientSpawningCells[cellId] = currCell
            // currCell.spawnCell = setInterval(createBadGuy, 60000)
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

function badGuyCollision(antibody, badGuy, damageFunction) {
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
        damageFunction.call(this, newHealth, badGuy)
      }
    }
  )
}
