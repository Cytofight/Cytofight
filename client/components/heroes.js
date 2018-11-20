import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getHeroesThunk} from '../store/characterReducer'
import Spritesheet from 'react-responsive-spritesheet'
import heroImg from '../animation-data/hero-image-configs'

const divStyle = [
  {
    height: '345px',
    width: '300px'
  },
  {
    height: '345px',
    width: '300px'
  },
  {
    height: '345px',
    width: '300px'
  },
  {
    height: '345px',
    width: '300px'
  },
  {
    height: '150px',
    width: '150px'
  }
]

const heroImgs = [
  {
    //Helper T
    height: 290,
    width: 310,
    fps: 40
  },
  {
    //Macrophage
    height: 283,
    width: 296,
    fps: 40
  },
  {
    //Killer T
    height: 292,
    width: 305,
    fps: 40
  },
  {
    //B-cell
    height: 250,
    width: 301,
    fps: 40
  },
  {
    //Antibody
    height: 140,
    width: 131,
    fps: 100
  }
]

class Heroes extends Component {
  componentDidMount() {
    this.props.populateHeroes()
  }
  render() {
    console.log(this.props)
    return (
      <div id="heroPage">
        <h1>The Heroes</h1>
        {this.props.heroes.length &&
          this.props.heroes.map(hero => {
            return (
              <div key={hero.id} className="hero">
                <h3>{hero.name}</h3>
                <div
                  className="spritesheet-container"
                  style={divStyle[hero.id - 1]}
                >
                  <Spritesheet
                    image={hero.img}
                    widthFrame={heroImgs[hero.id - 1].width}
                    heightFrame={heroImgs[hero.id - 1].height}
                    steps={64}
                    fps={heroImgs[hero.id - 1].fps}
                    autoplay={false}
                    loop={true}
                    onMouseEnter={spritesheet => {
                      spritesheet.play()
                    }}
                    onMouseLeave={spritesheet => {
                      spritesheet.pause()
                    }}
                  />
                </div>
                <p>{hero.blurb}</p>
              </div>
            )
          })}
      </div>
    )
  }
}

const mapStatetoProps = state => {
  return {heroes: state.characters}
}

const mapDispatchtoProps = dispatch => {
  return {
    populateHeroes: () => dispatch(getHeroesThunk())
  }
}

const connectedHeroes = connect(mapStatetoProps, mapDispatchtoProps)(Heroes)

export default connectedHeroes
