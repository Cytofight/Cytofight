import {
  players,
  keyboardControls,
  scoreAndStars,
  NPCCells
} from './createFunctions'

export function preload() {
  this.load.image('click', 'assets/PNG/play.png')
  this.load.image('ship', 'assets/PNG/b_cell.png')
  this.load.image('otherPlayer', 'assets/PNG/whitebloodcell.png')
  this.load.image('star', 'assets/PNG/star_gold.png')
  this.load.image('histamines', 'assets/PNG/Effects/star1.png')
  this.load.image('mastCell', 'assets/PNG/mast_cell.png')
  this.load.image('antibody', 'assets/PNG/antibody.png')
  this.load.image('dormantTCell', 'assets/PNG/whitebloodcell.png')
  this.load.image('epithelialCell', 'assets/PNG/epithelial_cell.png')
}

export function create() {
  // PUT IN A SETUP FUNC
  this.matter.world.setBounds(0, 0, 7000, 7000)
  this.cameras.main.setBounds(0, 0, 7000, 7000)
  players.call(this)
  keyboardControls.call(this)
  // scoreAndStars.call(this)
  NPCCells.call(this)
  this.matter.world.on('collisionstart', (event, bodyA, bodyB) => {
    // console.log('collision detected, emitting bodies:', bodyA)
    // console.log('ship id: ', this.ship.body.id)
    // console.log(this.epithelialCells)
    const matchingCell = this.epithelialCells.find(cell => (cell.body.id === bodyA.id || cell.body.id === bodyB.id))
    if (this.ship && matchingCell && (bodyA.id === this.ship.body.id || bodyB.id === this.ship.body.id) && (this.ship.tintBottomLeft === 214)) {
      matchingCell.setTint(0xd60000)
    }
    // this.socket.emit('anyCollision', bodyA, bodyB)
  })
  // this.socket.on('collided', (bodyA, bodyB) => {
  //   console.log('WHOLE DATAS: ', bodyA, bodyB)
  // })
}
