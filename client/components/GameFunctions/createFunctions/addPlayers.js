  import {limitNumber} from '../util'
  
  //Initialize the players in the game
  export function players() {
    console.log("TOP OF PAGE THIS: ", this)
    // const self = this
    this.socket = io()
    this.otherPlayers = []
    this.socket.on('currentPlayers', (players) => {
      Object.keys(players).forEach((id) => {
        if (players[id].playerId === this.socket.id) {
          addPlayer.call(this, this, players[id])
        } else {
          addOtherPlayers.call(this, this, players[id])
        }
      })
    })
    this.socket.on('newPlayer', (playerInfo) => {
      addOtherPlayers.call(this, this, playerInfo)
    })
    this.socket.on('disconnect', (playerId) => {
      this.otherPlayers.forEach((otherPlayer) => {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy()
          this.otherPlayers.filter(() => playerId !== otherPlayer.playerId)
        }
      })
    })
    this.socket.on('playerMoved', ({playerId, angle, position, velocity, angularVelocity}) => {
      this.otherPlayers.forEach((otherPlayer) => {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(position.x, position.y)
          otherPlayer.setVelocity(velocity.x, velocity.y)
          otherPlayer.setAngularVelocity(angularVelocity)
          otherPlayer.setAngle(angle)
        }
      })
    })
    console.log("THIS IS A THIS: ", this, "THIS IS this: ", this)
  }

  const shipParams = {
    restitution: 0.9,
    friction: 0.15,
    frictionAir: 0.05
  }

  function addPlayer(self, playerInfo) {
    // self.ship = self.physics.add
    //   .image(playerInfo.x, playerInfo.y, 'ship')
    //   .setOrigin(0.5, 0.5)
    //   .setDisplaySize(53, 40)
    const randomX = Math.floor(Math.random() * 1000)
    const randomY = Math.floor(Math.random() * 1000)
    this.ship = this.matter.add.image(randomX, randomY, 'ship')
    this.ship.setScale(0.5)
    this.ship.setCircle(this.ship.width / 2, {label: 'me', ...shipParams})
    this.cameras.main.startFollow(this.ship) //******* */
    if (playerInfo.team === 'blue') {
      this.ship.setTint(0xd60000)
    } else {
      this.ship.setTint(0x01c0ff)
    }
    this.input.on("pointermove", function(pointer) {
      const adjustedPointerX = limitNumber(pointer.x + this.ship.x - 400, pointer.x, pointer.x + 200)
      const adjustedPointerY = limitNumber(pointer.y + this.ship.y - 300, pointer.y, pointer.y + 400)
      // console.log('POINTERS AND ADJUSTS', pointer.x, adjustedPointerX, pointer.y, adjustedPointerY)
      // let adjustedPointerX = pointer.x, adjustedPointerY = pointer.y
      //DEPENDENT ON VIEWPORT AND MAP SIZING; REMEMBER TO CHANGE
      //greater than 600 x, greater than 700 Y for camera to STOP moving (map size - viewport / 2)
      // if (this.ship.y > 700) adjustedPointerY += 400
      // else if (this.ship.y > 300) adustedPointerY += this.ship.y - 300
      // if (this.ship.x > 600) adjustedPointerX += 200
      // else if (this.ship.x > 400) adjustedPointerX += this.ship.x - 400
      var angle = -Math.atan2(adjustedPointerX - this.ship.x, adjustedPointerY - this.ship.y) * 180 / Math.PI;
      // if (angle > 0) 
      console.log('ANGLE:))) ', angle)
      this.ship.angle = angle;
    }, this);
  }

  function addOtherPlayers(self, playerInfo) {
    // const otherPlayer = self.add
    //   .sprite(playerInfo.x, playerInfo.y, 'otherPlayer')
    //   .setOrigin(0.5, 0.5)
    //   .setDisplaySize(53, 40)
    const randomXY = Math.floor(Math.random() * 1000)
    const otherPlayer = this.matter.add.image(randomXY, randomXY, 'ship')
    otherPlayer.setScale(0.5);
    otherPlayer.setCircle(otherPlayer.width / 2, shipParams)
    if (playerInfo.team === 'blue') {
      otherPlayer.setTint(0xd60000)
    } else {
      otherPlayer.setTint(0x01c0ff)
    }
    otherPlayer.playerId = playerInfo.playerId
    this.otherPlayers.push(otherPlayer)
  }