export function scoreAndStars() {
  const self = this

  //Create the life stars and scoreboard associated with the collections
  self.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
    if (bodyA.label === 'me' && bodyB.label === 'star') {
      self.socket.emit('starCollected')
    }
  })

  this.socket.on('epithelialCount', function(scores) {
    self.blueScoreText.setText(
      'Healthy Epithelial Cells: ' +
        (Object.keys(self.epithelialCells).length -
          Object.keys(self.badGuys.epithelialCells).length)
    )
    self.redScoreText.setText(
      'Infected Epithelial Cells: ' +
        Object.keys(self.badGuys.epithelialCells).length
    )
  })

  this.socket.on('starLocation', function(starLocation) {
    // if (self.star) self.star.destroy()
    self.star = self.matter.add
      .image(starLocation.x, starLocation.y, 'star', null, {label: 'star'})
      .setStatic(true)
      .setSensor(true)
  })

  this.socket.on('starDestroy', function() {
    if (self.star) self.star.destroy()
  })
}
