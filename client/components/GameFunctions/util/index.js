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

export function fire ({x, y, angle}) {
  console.log("FIRE!!! But working now! I swear!")
  let antibody = this.antibodies.get();
  if(antibody) {
    antibody.fire(x, y, angle);
  }
}
// export const throttledFire = throttle(fire, 200)

export function updateForce(cellsObj) {
  for (let key in cellsObj) {
    const randomX = Math.random() * 0.001 - 0.0005
    const randomY = Math.random() * 0.001 - 0.0005
    cellsObj[key].randomDirection = {x: randomX, y: randomY}
  }
}

export function limitNumber(num, lowerLimit, higherLimit) {
  if (lowerLimit > higherLimit) [lowerLimit, higherLimit] = [higherLimit, lowerLimit]
  
  if (num < lowerLimit) return lowerLimit
  if (num > higherLimit) return higherLimit
  return num
}

export function activate(cell) {
  cell.setVelocity(0, 0) //PLACEHOLDER
  console.log("I'm a good guy now!")
  cell.setTint(0x01c0ff)
  this.goodGuys.push(cell)
  cell.activated = true
}

export function overlapCollision(coords, largeBody, callback, ...args) {
  if (largeBody.getBounds().contains(coords.x, coords.y)) {
    callback.call(this, ...args)
  }
}