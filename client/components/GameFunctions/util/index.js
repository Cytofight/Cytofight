export function limitSpeed(obj, maxSpeed) {
  const velX = obj.body.velocity.x
  const velY = obj.body.velocity.y
  const velXMultiplier = (velX < 0 ? -1 : 1 ) * maxSpeed
  const velYMultiplier = (velY < 0 ? -1 : 1 ) * maxSpeed

  if (Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2)) > maxSpeed) {
    // console.log('Too fast!')
    const angle = Math.abs(Math.atan(velY / velX))
    // console.log('THING: ', angle, Math.cos(angle))
    const newX = Math.cos(angle)
    const newY = Math.sin(angle)
    // console.log(newX, newY)
    // console.log(this.ship.body)
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
    antibody.fire(this.ship.body.position.x, this.ship.body.position.y);
  }
}
// export const throttledFire = throttle(fire, 200)

export function updateForce(obj) {
  const randomX = Math.random() * 0.0006 - 0.0003
  const randomY = Math.random() * 0.0006 - 0.0003
  obj.randomDirection = {x: randomX, y: randomY}
  // cells have a max speed
  // each cell has its own per-update x,y force
  // force changes every ? ms
}