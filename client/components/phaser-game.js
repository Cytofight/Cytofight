// var React = require('react-phaser')
import Phaser from 'phaser'
import React, {Component} from 'react'
import startMenu from './GameFunctions/startMenu'
import gamePlay from './GameFunctions/index'

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
