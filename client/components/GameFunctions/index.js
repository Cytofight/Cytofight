import {preload, create} from './create'
import {update} from './update'

export default class gamePlay extends Phaser.Scene {
  constructor() {
    super('gamePlay')

  }
  preload = preload
  create = create
  update = update
}

// export {preload, create, update}
