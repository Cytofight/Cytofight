// var React = require('react-phaser')
import Phaser from 'phaser'
import React, {Component} from 'react'
import startMenu from './GameFunctions/startMenu'
import gamePlay from './GameFunctions/index'
import { worldSize } from './GameFunctions/util'

const config = {
  type: Phaser.AUTO,
  parent: 'container',
  width: 800,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
      // debug: false,
      gravity: {
        y: 0
      }
    }
  },
  scene: [startMenu, gamePlay]
}

export class Antibody extends Phaser.GameObjects.Image {
  constructor(scene) {
    super(scene)
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "antibody")
    this.speed = Phaser.Math.GetSpeed(575, 1)
    this.velocity = new Phaser.Geom.Point(0, 0)
    this.setScale(0.15)
  }
  
  fire(x, y, direction) {
    this.setPosition(x, y)
      .setActive(true)
      .setVisible(true)
    this.velocity.setTo(0, -this.speed)
    Phaser.Math.Rotate(this.velocity, direction)
  }
  
  update(time, delta) {
    this.y -= this.velocity.y * delta;
    this.x -= this.velocity.x * delta;
    
    if (this.y < -50 || this.x < -50 || this.y > worldSize.y + 50 || this.x > worldSize.x + 50) {
      // this.setActive(false);
      // this.setVisible(false);
      this.destroy()
    }
  }
}

export default class Game extends Component {
  constructor(props) {
    super(props)
    this.game = null
  }

  componentDidMount() {
    this.game = new Phaser.Game(config)
  }

  render() {
    return (
      <div id="container">
        <h3> Prepare for Battle!</h3>
      </div>
    )
  }
}
