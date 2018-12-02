import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getHeroesThunk} from '../store/characterReducer'
import Spritesheet from 'react-responsive-spritesheet'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'

const divStyle = [
  {
    height: '340px',
    width: '300px'
  },
  {
    height: '340px',
    width: '300px'
  },
  {
    height: '340px',
    width: '300px'
  },
  {
    height: '340px',
    width: '300px'
  },
  {
    height: '180px',
    width: '180px',
    paddingTop: '80px',
    paddingBottom: '80px'
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
    width: 301,
    fps: 40
  },
  {
    //B-cell
    height: 250,
    width: 305,
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
    return (
      <Grid container justify="center">
        <h1>The Heroes</h1>
        <Grid
          container
          direction="row"
          spacing={24}
          style={{
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {this.props.heroes.length &&
            this.props.heroes.map(hero => {
              return (
                <div key={hero.id} className="hero">
                  <Grid item xs={6}>
                    <Card
                      style={{
                        padding: 20,
                        width: 300,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                      }}
                    >
                      <h3>{hero.name}</h3>
                      <div
                        className="spritesheet- container"
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
                    </Card>
                  </Grid>
                </div>
              )
            })}
        </Grid>
      </Grid>
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

export default connect(mapStatetoProps, mapDispatchtoProps)(Heroes)
