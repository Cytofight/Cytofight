function fire () {
  console.log("FIRE!!! But working now! I swear!")
  let antibody = this.antibodies.get();
  if(antibody) {
    antibody.fire(this.ship.body.position.x, this.ship.body.position.y, this.ship.body.angle);
  }
}

module.exports = {fire}