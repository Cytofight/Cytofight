// Speed-related functions for cells

export function limitSpeed(obj, maxSpeed) {
  const velX = obj.body.velocity.x
  const velY = obj.body.velocity.y
  const velXMultiplier = (velX < 0 ? -1 : 1) * maxSpeed
  const velYMultiplier = (velY < 0 ? -1 : 1) * maxSpeed

  if (Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2)) > maxSpeed) {
    const angle = Math.abs(Math.atan(velY / velX))
    const newX = Math.cos(angle)
    const newY = Math.sin(angle)
    obj.setVelocity(newX * velXMultiplier, newY * velYMultiplier)
  }
}

export function updateForce(cellsObj) {
  for (let key in cellsObj) {
    if (!cellsObj[key].following) {
      const randomX = Math.random() * 0.002 - 0.001
      const randomY = Math.random() * 0.002 - 0.001
      cellsObj[key].randomDirection = {
        x: randomX,
        y: randomY
      }
    }
  }
}

export function limitNumber(num, lowerLimit, higherLimit) {
  if (lowerLimit > higherLimit)[lowerLimit, higherLimit] = [higherLimit, lowerLimit]

  if (num < lowerLimit) return lowerLimit
  if (num > higherLimit) return higherLimit
  return num
}

// Throttle function for controlling projectile firing rate

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
  