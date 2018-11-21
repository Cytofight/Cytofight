import {
  players,
  keyboardControls,
  scoreAndStars,
  NPCCells
} from './createFunctions'
import {Antibody} from '../phaser-game'

export function preload() {
  this.load.image('click', 'assets/PNG/play.png')
  this.load.image('ship', 'assets/PNG/B_Cell_transparent.png')
  this.load.image('otherPlayer', 'assets/PNG/White_blood_cell_transparent.png')
  this.load.image('star', 'assets/PNG/star_gold.png')
  this.load.image('histamines', 'assets/PNG/Effects/star1.png')
  this.load.image('mastCell', 'assets/PNG/mast_cell_transparent.png')
  this.load.image('antibody', 'assets/PNG/antibody.png')
  this.load.image('dormantTCell', 'assets/PNG/White_blood_cell_transparent.png')
  this.load.image('epithelialCell', 'assets/PNG/epithelial_transparent.png')
}

export function create() {
  // PUT IN A SETUP FUNC
  this.matter.world.setBounds(0, 0, 7000, 7000)
  this.cameras.main.setBounds(0, 0, 7000, 7000)
  players.call(this)
  // const test = new Bullet(this)
  this.antibodies = this.add.group({
    classType: Antibody,
    maxSize: 20,
    runChildUpdate: true
  })
  keyboardControls.call(this)
  // scoreAndStars.call(this)
  NPCCells.call(this)
  // this.socket.on('collided', (bodyA, bodyB) => {
  //   console.log('WHOLE DATAS: ', bodyA, bodyB)
  // })
}
