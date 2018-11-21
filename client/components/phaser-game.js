// var React = require('react-phaser')
import Phaser from 'phaser'
import React, {Component} from 'react'
import gamePlay from './GameFunctions/index'
import startMenu from './GameFunctions/startMenu'

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
    console.log('in the constructor')
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "antibody")
    console.log(this)
    this.speed = Phaser.Math.GetSpeed(575, 1)
    this.velocity = new Phaser.Geom.Point(0, 0)
    this.setScale(0.15)
    // console.log(this, scene.ship)
  }
  
  fire(x, y, direction) {
    this.setPosition(x, y)
      .setActive(true)
      .setVisible(true)
    this.velocity.setTo(0, -this.speed)
    console.log(direction)
    Phaser.Math.Rotate(this.velocity, direction)
    console.log(this.velocity)
  }
  
  update(time, delta) {
    this.y -= this.velocity.y * delta;
    this.x -= this.velocity.x * delta;
    
    if (this.y < -50 || this.x < -50 || this.y > 1000 || this.x > 1000) {
      console.log('gone awaaay')
      this.setActive(false);
      this.setVisible(false);
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
    console.log(document.eve)
    console.log('hi')
  }

  render() {
    return (
      <div id="container">
        <h3> Prepare for Battle!</h3>
      </div>
    )
  }
}
