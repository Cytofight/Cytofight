  //Initialize the players in the game
  export function players() {
    const self = this
    this.socket = io()
    this.otherPlayers = this.physics.add.group()
    this.socket.on('currentPlayers', function (players) {
      Object.keys(players).forEach(function (id) {
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
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy()
        }
      })
    })
    this.socket.on('playerMoved', function (playerInfo) {
      self.otherPlayers.getChildren().forEach(function (otherPlayer) {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation)
          otherPlayer.setPosition(playerInfo.x, playerInfo.y)
        }
      })
    })

    //Create the keys to play the game
    this.cursors = this.input.keyboard.createCursorKeys()

    //These 'WASD' keys need to be refractored so that the keycode numbers aren't hardcoded in. Console logging of Phaser.KeyCode suggests the property doesn't exist?
    this.keyUp = this.input.keyboard.addKey(87) // W
    this.keyLeft = this.input.keyboard.addKey(65) // A
    this.keyDown = this.input.keyboard.addKey(83) // S
    this.keyRight = this.input.keyboard.addKey(68) // D
    this.keyFire = this.input.keyboard.addKey(32) // Spacebar

  }

  function addPlayer(self, playerInfo) {
    self.ship = self.physics.add
      .image(playerInfo.x, playerInfo.y, 'ship')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(53, 40)
      self.cameras.main.startFollow(self.ship) //******* */
    if (playerInfo.team === 'blue') {
      self.ship.setTint(0x0000ff)
    } else {
      self.ship.setTint(0xff0000)
    }
    self.ship.setDrag(100)
    self.ship.setAngularDrag(100)
    self.ship.setMaxVelocity(200)
  }

  function addOtherPlayers(self, playerInfo) {
    const otherPlayer = self.add
      .sprite(playerInfo.x, playerInfo.y, 'otherPlayer')
      .setOrigin(0.5, 0.5)
      .setDisplaySize(53, 40)
    if (playerInfo.team === 'blue') {
      otherPlayer.setTint(0x0000ff)
    } else {
      otherPlayer.setTint(0xff0000)
    }
    otherPlayer.playerId = playerInfo.playerId
    self.otherPlayers.add(otherPlayer)
  }
