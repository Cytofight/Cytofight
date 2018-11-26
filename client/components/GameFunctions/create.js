import {
  players,
  keyboardControls,
  scoreAndStars,
  NPCCells
} from './createFunctions'
import {
  Antibody
} from '../phaser-game'
import {
  worldSize
} from './util'

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

  //  The world is 3200 x 600 in size
  this.cameras.main.setBounds(0, 0, worldSize.x, worldSize.y).setName('main');

  //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
  console.log("CAMERA:", this.cameras)
  this.minimap = this.cameras.add(640, 490, 150, 100).setZoom(0.1).setName('mini');
  this.minimap.setBackgroundColor(0x002244);
  this.minimap.scrollX = 2000;
  this.minimap.scrollY = 2000;

  // PUT IN A SETUP FUNC
  this.matter.world.setBounds(0, 0, worldSize.x, worldSize.y)
  this.cameras.main.setBounds(0, 0, worldSize.x, worldSize.y)
  players.call(this)
  this.antibodies = this.add.group({
    classType: Antibody,
    maxSize: 100,
    runChildUpdate: true
  })
  keyboardControls.call(this)
  // scoreAndStars.call(this)
  NPCCells.call(this)
  console.log(this.antibodies)
  //antibodies.children.entries
  //antibodies.getChildren()
}
