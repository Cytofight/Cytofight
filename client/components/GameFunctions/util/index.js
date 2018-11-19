export function limitSpeed(velX, velY) {
  const maxSpeed = 10
  const velXMultiplier = (velX < 0 ? -1 : 1 ) * maxSpeed
  const velYMultiplier = (velY < 0 ? -1 : 1 ) * maxSpeed

  if (Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2)) > maxSpeed) {
    console.log('Too fast!')
    const angle = Math.abs(Math.atan(velY / velX))
    // console.log('THING: ', angle, Math.cos(angle))
    const newX = Math.cos(angle)
    const newY = Math.sin(angle)
    // console.log(newX, newY)
    // console.log(this.ship.body)
    this.ship.setVelocity(newX * velXMultiplier, newY * velYMultiplier)
  }
}

export function throttle(func, milliseconds) {
  let time = Date.now() - milliseconds;
  return function(...args){
    if(Date.now() - time >= milliseconds){
      let res = func(...args)
      time = Date.now()
      return res
    }
  }
}

export function fire () {
  console.log("FIRE!!! But working now!")
}
// export const throttledFire = throttle(fire, 200)

export function randomTravel(x, y) {
  
}