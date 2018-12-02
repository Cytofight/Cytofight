import {
  limitSpeed,
  throttle,
  fire,
  updateForce,
  overlapCollision,
  changeShipColorDebug,
  updateSecretColor,
  resetCells
} from './util'
import {
  killEpithelialCell,
  damageEpithelialCell
} from './createFunctions/epithelialCells'
import { damageBadPlayer, killBadPlayer } from './createFunctions/addPlayers'
import { killInfectedCell, damageInfectedCell, makeInfectedCell, spawnInfectedCell } from './createFunctions/npcInfectedCell'
import { followBadGuy } from './createFunctions/tCells';

// let temp = 0
const throttledConsoleLog = throttle(console.log, 2000)
const throttledUpdateTCellForce = throttle(updateForce, 1800)
const throttledUpdateInfectedCellForce = throttle(updateForce, 1800)
const throttledFire = throttle(fire, 150)
// const throttledChangeShipColorDebug = throttle(changeShipColorDebug, 500)
let tCellLimiter = 0,
  mastCellLimiter = 0,
  infectedCellLimiter = 1,
  redBloodCellsLimiter = 0,
  soundLimiter = 0

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
      if (cell.following && !cell.following.body) cell.following = null
      if (cell.following) followBadGuy(cell, cell.following.body.position)
      cell.applyForce(cell.randomDirection)
      limitSpeed(cell, 2.5)
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
        // if (cell.tintBottomLeft === 16760833 || cell.tintBottomLeft === 0x01c0ff) cellData[id].tint = 0x01c0ff
        if (cell.following) {
          // console.log('following')
          const cellPosition = cell.body.position
          const enemyPosition = cell.following.body.position
          const distance = Math.sqrt(Math.pow(cellPosition.x - enemyPosition.x, 2) + Math.pow(cellPosition.y - enemyPosition.y, 2))
          // if (distance > cell.followRadius.radius * 2 + 150) {
          //   cell.following = null
          //   // cell.damageLimiter = 0
          //   console.log('out of range, stopped following')
          // } else {
          //   // console.log('bad guy health: ', cell.following.health, 'damageLimiter: ', !!(cell.damageLimiter && cell.damageRadius.contains(cell.following.body.position.x, cell.following.body.position.y)))
          //   if (cell.damageRadius.contains(cell.following.body.position.x, cell.following.body.position.y)) {
          //     if (this.badGuys.infectedCells[cell.following.globalId] === cell.following) {
          //       damageInfectedCell.call(this, cell.following.health - 1, cell.following)
          //       // console.log('damaged infected cell!', cell.following.health)
          //     }
          //     else {
          //       damageBadPlayer.call(this, cell.following.health - 1, cell.following)
          //       // console.log('damaged player!', cell.following.health)
          //     }
          //   }
          //   cell.damageLimiter = (cell.damageLimiter + 1) % 20
          //   // console.log(cell.damageLimiter, cell.following)
          // }
          // console.log(distance < 200 && !cell.damageLimiter)
          if (distance > 310) {
            cell.following = null
            console.log('out of range, stopped following, distance version')
          } else if (distance < 100 && !cell.damageLimiter) {
            const damageFunction = this.badGuys.infectedCells[cell.following.globalId] === cell.following ? damageInfectedCell : damageBadPlayer
            damageFunction.call(this, cell.following.health - 1, cell.following)
            console.log('damaged something, distance version; remaining health: ', cell.following.health)
          }
          cell.damageLimiter = (cell.damageLimiter + 1) % 7
        } else if (cell.activated) {
          for (let id in this.badGuys.players) {
            const badPlayer = this.badGuys.players[id]
            // if (cell.followRadius.contains(badPlayer.body.position.x, badPlayer.body.position.y) && 
            // cell.activated && !cell.following) {
            //   cell.following = badPlayer
            //   console.log('start follow player', cell.damageLimiter)
            // }
            const cellPosition = cell.body.position
            const enemyPosition = badPlayer.body.position
            const distance = Math.sqrt(Math.pow(cellPosition.x - enemyPosition.x, 2) + Math.pow(cellPosition.y - enemyPosition.y, 2))
            if (distance < 250) {
              cell.following = badPlayer
              console.log('start follow player, distance version')
            }
          }
          for (let id in this.badGuys.infectedCells) {
            const badCell = this.badGuys.infectedCells[id]
            // if (cell.followRadius.contains(badCell.body.position.x, badCell.body.position.y) && 
            // cell.activated && !cell.following) {
            //   cell.following = badCell
            //   console.log('start follow bad cell')
            // }
            const cellPosition = cell.body.position
            const enemyPosition = badCell.body.position
            const distance = Math.sqrt(Math.pow(cellPosition.x - enemyPosition.x, 2) + Math.pow(cellPosition.y - enemyPosition.y, 2))
            if (distance < 250) {
              cell.following = badCell
              console.log('start follow bad cell, distance version')
            }
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
  
  soundLimiter = (soundLimiter + 1) % 13

  window.hack = 'securitronAndCone'

  if (this.badGuys.players[this.socket.id]) {
    for (let cellId in this.epithelialCells) {
      if (!this.badGuys.epithelialCells[cellId]) {
        const currCell = this.epithelialCells[cellId]
        if (
          currCell && currCell.infectionRange && 
          currCell.infectionRange.contains(
            this.ship.body.position.x,
            this.ship.body.position.y
            )
            ) {
          if(!soundLimiter){
            this.infectionSound.play()
          }
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
            }, 20000)
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
