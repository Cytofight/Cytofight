export function keyboardControls() {
  //Create the keys to play the game
  this.cursors = this.input.keyboard.createCursorKeys()

  // Create WASD movement controls
  this.keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W) // W
  this.keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A) // A
  this.keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S) // S
  this.keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D) // D

  // Need to replace spacebar with left mouse click control 
  this.keyFire = this.input.keyboard.addKey(32) // Spacebar
  
  this.keyDebug = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B) // B
  this.keyCreateCell = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C) // C

}
