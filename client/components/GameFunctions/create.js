import {
  players,
  keyboardControls,
  scoreAndStars,
} from './createFunctions'
import {Antibody} from '../phaser-game'
import {worldSize} from './util'

export function preload() {
  this.load.image('click', 'assets/PNG/play.png')
  this.load.image('ship', 'assets/PNG/b-cell-transparent.png')
  this.load.image('otherPlayer', 'assets/PNG/White_blood_cell_transparent.png')
  this.load.image('star', 'assets/PNG/star_gold.png')
  this.load.image('histamines', 'assets/PNG/Effects/star1.png')
  this.load.image('mastCell', 'assets/PNG/mast_cell_transparent.png')
  this.load.image('antibody', 'assets/PNG/antibody-game-transparent.png')
  this.load.image('dormantTCell', 'assets/PNG/White_blood_cell_transparent.png')
  this.load.image('epithelialCell', 'assets/PNG/epithelial_transparent.png')
  this.load.image('redback', 'assets/PNG/redback.png')
}

export function create() {
//*************************************************************** */
  // This code is for rendering an image to the canvas background
  // Problem: any image large enough to cover the world canvas size is too large to be pushed to github;
  // Phaser 3.0 seems to only be able to load images from a local assets folder and is restricted to using PNG images
  this.add.image((worldSize.x/2), (worldSize.y/2), 'redback')
//*************************************************************** */

  //  The world is 3200 x 600 in size
  this.cameras.main.setBounds(0, 0, worldSize.x, worldSize.y).setName('main')

  //  The miniCam is 400px wide, so can display the whole world at a zoom of 0.2
  this.minimap = this.cameras
    .add(640, 490, 150, 100)
    .setZoom(0.1)
    .setName('mini')
  this.minimap.setBackgroundColor(0x002244)
  this.minimap.scrollX = 2000
  this.minimap.scrollY = 2000

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
}
