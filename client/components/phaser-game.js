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
    super(scene);
    console.log('in the constructor')
    Phaser.GameObjects.Image.call(this, scene, 0, 0, "antibody");
    this.speed = Phaser.Math.GetSpeed(400, 1);
    console.log(this, scene.ship)
  }
  
  fire(x, y) {
    this.setPosition(x, y - this.scene.ship.height/2);
    this.angle = this.scene.ship.body.angle
      this.setActive(true);
      this.setVisible(true);
  }
  
  update(time, delta) {
    this.y -= this.speed * delta;
    this.x -= this.speed * delta;
    
    if (this.y < -50) {
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
  }

  render() {
    return (
      <div id="container">
        <h3> Prepare for Battle!</h3>
      </div>
    )
  }
}
