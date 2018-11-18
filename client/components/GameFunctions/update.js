import { NPCCells } from './createFunctions';

// const debounce = require('lodash.debounce')

const throttle = (func, milliseconds) => {
  let time = Date.now() - milliseconds;
  return function(...args){
    if(Date.now() - time >= milliseconds){
      let res = func(...args)
      time = Date.now()
      return res
    }
  }
}

const throttledFire = throttle(fire, 200)

function fire () {
  console.log("FIRE!!! But working now!")
}

export function update(time) {
  if (this.ship) {
    const maxSpeed = 10
    const accel = 0.005
    const velX = this.ship.body.velocity.x
    const velXMultiplier = (velX < 0 ? -1 : 1 ) * maxSpeed
    const velY = this.ship.body.velocity.y
    const velYMultiplier = (velY < 0 ? -1 : 1 ) * maxSpeed

    if (this.cursors.left.isDown || this.keyLeft.isDown) {
      this.ship.applyForce({x: -0.005, y: 0})
    } else if (this.cursors.right.isDown || this.keyRight.isDown) {
      this.ship.applyForce({x: 0.005, y: 0})
    } else if (this.cursors.up.isDown || this.keyUp.isDown) {
      this.ship.applyForce({x: 0, y: -0.005})
    } else if (this.cursors.down.isDown || this.keyDown.isDown) {
      this.ship.applyForce({x: 0, y: 0.005})
    } 

    if (Math.sqrt(Math.pow(velX, 2) + Math.pow(velY, 2)) > maxSpeed) {
      console.log('Too fast!')
      const angle = Math.abs(Math.atan(velY / velX))
      console.log('THING: ', angle, Math.cos(angle))
      const newX = Math.cos(angle)
      const newY = Math.sin(angle)
      console.log(newX, newY)
      console.log(this.ship.body)
      this.ship.setVelocity(newX * velXMultiplier, newY * velYMultiplier)
    }

    // this.physics.world.wrap(this.ship, 5)
    
    //This needs to be edited so that your cell has the ability to fire antibodies
    if(this.keyFire.isDown){
      // console.log("Fire!")
      // limit(400, fire)
      throttledFire()
    }

    // emit player movement
    const x = this.ship.body.position.x
    const y = this.ship.body.position.y
    const r = this.ship.rotation
    if (
      this.ship.oldPosition &&
      (x !== this.ship.oldPosition.x ||
        y !== this.ship.oldPosition.y ||
        r !== this.ship.oldPosition.rotation)
    ) {
      this.socket.emit('playerMovement', {
        x: this.ship.x,
        y: this.ship.y,
        rotation: this.ship.rotation
      })
    }

    // save old position data
    this.ship.oldPosition = {
      x: this.ship.x,
      y: this.ship.y,
      rotation: this.ship.rotation
    }
  }
}
