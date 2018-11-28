// Fire antibodies function for memory B cells (main character for good guys)
export function fire (prevInfo) {
    let firingInfo
    if (!prevInfo) {
      let randomDamage = Math.floor(Math.random() * 10) + 10
      let randomColor = Math.floor(Math.random() * 16777215)
      if (this.secretColor.found) {
        randomColor = this.secretColor.value
      }
      firingInfo = {
        x: this.ship.body.position.x,
        y: this.ship.body.position.y,
        angle: this.ship.body.angle,
        globalId: this.socket.id,
        type: 'ship',
        color: randomColor,
        damage: randomDamage
      }
    } else {
      firingInfo = prevInfo
    }
    let antibody = this.antibodies.get();
    if(antibody) {
      antibody.setTint(firingInfo.color)
      antibody.fire(firingInfo);
      if (!prevInfo) this.socket.emit('firedAntibody', firingInfo)
    }
  }