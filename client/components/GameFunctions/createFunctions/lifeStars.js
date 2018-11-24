export function scoreAndStars() {
  const self = this
  this.blueScoreText = this.add.text(16, 16, '', {
    fontSize: '32px',
    fill: '#0000FF'
  })
  this.redScoreText = this.add.text(584, 16, '', {
    fontSize: '32px',
    fill: '#FF0000'
  })

  //Create the life stars and scoreboard associated with the collections
  self.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
    if(bodyA.label === 'me' && bodyB.label === 'star') {
      self.socket.emit('starCollected')
    }
  })
  this.socket.on('scoreUpdate', function (scores) {
    self.blueScoreText.setText('Blue: ' + scores.blue)
    self.redScoreText.setText('Red: ' + scores.red)
  })

  this.socket.on('starLocation', function (starLocation) {
    if (self.star) self.star.destroy()
    self.star = self.matter.add.image(starLocation.x, starLocation.y, 'star', null, {label: 'star'}).setStatic(true).setSensor(true)
    // self.physics.add.overlap(self.ship, self.star, function () {
    //   this.socket.emit('starCollected')
    // }, null, self)
  })
}
