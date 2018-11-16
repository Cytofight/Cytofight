export function keyboardControls() {
  //Create the keys to play the game
  this.cursors = this.input.keyboard.createCursorKeys()

  //These 'WASD' keys need to be refractored so that the keycode numbers aren't hardcoded in. Console logging of Phaser.KeyCode suggests the property doesn't exist?
  this.keyUp = this.input.keyboard.addKey(87) // W
  this.keyLeft = this.input.keyboard.addKey(65) // A
  this.keyDown = this.input.keyboard.addKey(83) // S
  this.keyRight = this.input.keyboard.addKey(68) // D
  this.keyFire = this.input.keyboard.addKey(32) // Spacebar

}
