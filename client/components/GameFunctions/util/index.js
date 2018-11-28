export const worldSize = {x: 2000, y: 2000}
export const colorNumber = 64

export const defaultCellParams = {
  restitution: 1,
  friction: 0,
  frictionAir: 0
}



export function limitSpeed(obj, maxSpeed) {
  const velX = obj.body.velocity.x
  const velY = obj.body.velocity.y
  const velXMultiplier = (velX < 0 ? -1 : 1 ) * maxSpeed
  const velYMultiplier = (velY < 0 ? -1 : 1 ) * maxSpeed

  if (Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2)) > maxSpeed) {
    const angle = Math.abs(Math.atan(velY / velX))
    const newX = Math.cos(angle)
    const newY = Math.sin(angle)
    obj.setVelocity(newX * velXMultiplier, newY * velYMultiplier)
  }
}

export function throttle(func, milliseconds) {
  let time = Date.now() - milliseconds;
  return function(...args){
    if(Date.now() - time >= milliseconds){
      let res = func.apply(this, args)
      time = Date.now()
      return res
    }
  }
}

export function fire (prevInfo) {
  let firingInfo
  if (!prevInfo) {
    let randomDamage = Math.floor(Math.random() * 10) + 10
    let randomColor = Math.floor(Math.random() * 16777215)
    if (this.secretColor.found) {
      randomColor = this.secretColor.value
    }
    firingInfo = {
      x: this.ship.body.position.x,
      y: this.ship.body.position.y,
      angle: this.ship.body.angle,
      globalId: this.socket.id,
      type: 'ship',
      color: randomColor,
      damage: randomDamage
    }
  } else {
    firingInfo = prevInfo
  }
  let antibody = this.antibodies.get();
  if(antibody) {
    antibody.setTint(firingInfo.color)
    antibody.fire(firingInfo);
    if (!prevInfo) this.socket.emit('firedAntibody', firingInfo)
  }
}

export function updateForce(cellsObj) {
  for (let key in cellsObj) {
    const randomX = Math.random() * 0.002 - 0.001
    const randomY = Math.random() * 0.002 - 0.001
    cellsObj[key].randomDirection = {x: randomX, y: randomY}
  }
}

export function limitNumber(num, lowerLimit, higherLimit) {
  if (lowerLimit > higherLimit) [lowerLimit, higherLimit] = [higherLimit, lowerLimit]
  
  if (num < lowerLimit) return lowerLimit
  if (num > higherLimit) return higherLimit
  return num
}

export function overlapCollision(coords, largeBody, callback, ...args) {
  if (largeBody.getBounds().contains(coords.x, coords.y)) {
    callback.call(this, ...args)
  }
}

export function setCellParams(cell, { positionX, positionY, velocityX, velocityY, angle, angularVelocity, randomDirection, tint, globalId }) {
  cell.setPosition(positionX, positionY)
  cell.setVelocity(velocityX, velocityY)
  // cell.setAngle(angle) // blocks spin transmission for some reason
  cell.setAngularVelocity(angularVelocity)
  if(tint && tint !== cell.tintBottomLeft) {
    cell.setTint(tint)
  }
  if (randomDirection) cell.randomDirection = randomDirection
  cell.globalId = globalId
}

// CURRENTLY BROKEN, DO NOT USE
export function changeShipColorDebug(tint) {
  let prevAlignment, nextAlignment
  const currShipTint = this.ship.tintBottomLeft
  this.ship.setTint(tint)
  if (tint === 0x01c0ff && currShipTint === 214) {
    prevAlignment = this.badGuys
    nextAlignment = this.goodGuys
  } else if (tint === 0xd60000 && currShipTint === 16760833) {
    prevAlignment = this.goodGuys
    nextAlignment = this.badGuys
  }
  console.log('previous and next alignments: ', prevAlignment, nextAlignment)
  const currIndex = prevAlignment.indexOf(this.ship)
  console.log(currIndex)
  if (currIndex !== -1) prevAlignment.splice(currIndex, 1)
  nextAlignment.push(this.ship)
  console.log('ship tint is blue: ', this.ship.tintBottomLeft === 16760833, 'ship tint is red: ', this.ship.tintBottomLeft === 214, 'arrays now: ', this.badGuys, this.goodGuys)
}

export function updateSecretColor(color) {
  if (color - this.secretColor.value <= 262000 && color - this.secretColor.value >= -262000) {
    this.secretColor.found = true
    return true
  }
  return false
}