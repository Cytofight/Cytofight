  //Initialize the players in the game
  export function players() {
    const self = this
    this.socket = io()
    this.otherPlayers = []
    this.socket.on('currentPlayers', function (players) {
      Object.keys(players).forEach(function(id) {
        if (players[id].playerId === self.socket.id) {
          addPlayer(self, players[id])
        } else {
          addOtherPlayers(self, players[id])
        }
      })
    })
    this.socket.on('newPlayer', function (playerInfo) {
      addOtherPlayers(self, playerInfo)
    })
    this.socket.on('disconnect', function (playerId) {
      self.otherPlayers.forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy()
          self.otherPlayers.filter(() => playerId !== otherPlayer.playerId)
        }
      })
    })
    this.socket.on('playerMoved', function ({playerId, angle, position, velocity, angularVelocity}) {
      self.otherPlayers.forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.setPosition(position.x, position.y)
          otherPlayer.setVelocity(velocity.x, velocity.y)
          otherPlayer.setAngularVelocity(angularVelocity)
          otherPlayer.setAngle(angle)
        }
      })
    })
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
    playerInfo.x = 500
    playerInfo.y = 500
    self.ship = self.matter.add.image(playerInfo.x, playerInfo.y, 'ship')
    self.ship.setScale(0.5)
    self.ship.setCircle(self.ship.width / 2, {label: 'me', ...shipParams})
    self.cameras.main.startFollow(self.ship) //******* */
    if (playerInfo.team === 'blue') {
      self.ship.setTint(0x0000ff)
    } else {
      self.ship.setTint(0xff0000)
    }
    console.log('ME: ', self.ship)
    // self.ship.setDrag(100)
    // self.ship.setAngularDrag(100)
    // self.ship.setMaxVelocity(200)
  }

  function addOtherPlayers(self, playerInfo) {
    // const otherPlayer = self.add
    //   .sprite(playerInfo.x, playerInfo.y, 'otherPlayer')
    //   .setOrigin(0.5, 0.5)
    //   .setDisplaySize(53, 40)
    const otherPlayer = self.matter.add.image(playerInfo.x, playerInfo.y, 'ship')
    otherPlayer.setScale(0.5);
    otherPlayer.setCircle(otherPlayer.width / 2, shipParams)
    if (playerInfo.team === 'blue') {
      otherPlayer.setTint(0x0000ff)
    } else {
      otherPlayer.setTint(0xff0000)
    }
    otherPlayer.playerId = playerInfo.playerId
    self.otherPlayers.push(otherPlayer)
  }
