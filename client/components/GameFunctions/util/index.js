export const worldSize = {x: 2000, y: 2000}

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

export function fire () {
  console.log("FIRE!!! But working now! I swear!")
  let antibody = this.antibodies.get();
  if(antibody) {
    antibody.fire(this.ship.body.position.x, this.ship.body.position.y, this.ship.body.angle);
  }
}
// export const throttledFire = throttle(fire, 200)

export function updateForce(objObj) {
  for (let key in objObj) {
    const randomX = Math.random() * 0.001 - 0.0005
    const randomY = Math.random() * 0.001 - 0.0005
    objObj[key].randomDirection = {x: randomX, y: randomY}
  }
  // cells have a max speed
  // each cell has its own per-update x,y force
  // force changes every ? ms
  // const cellData = Object.keys(objObj).reduce((obj, id) => {
  //   const currCell = objObj[id]
  //   obj[id] = {
  //     positionX: currCell.body.position.x, positionY: currCell.body.position.y,
  //     velocityX: currCell.body.velocity.x, velocityY: currCell.body.velocity.y,
  //     angle: currCell.body.angle, angularVelocity: currCell.body.angularVelocity,
  //     randomDirection: currCell.randomDirection,
  //     globalId: currCell.globalId
  //   }
  //   console.log('random dir being sent: ', currCell.randomDirection)
  //   return obj
  // }, {})
  // this.socket.emit('changedTCells', cellData)
}

export function limitNumber(num, lowerLimit, higherLimit) {
  if (lowerLimit > higherLimit) [lowerLimit, higherLimit] = [higherLimit, lowerLimit]
  
  if (num < lowerLimit) return lowerLimit
  if (num > higherLimit) return higherLimit
  return num
}