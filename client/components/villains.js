import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getVillainsThunk} from '../store/characterReducer'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'

class Villains extends Component {
  componentDidMount() {
    this.props.populateVillains()
  }

  render() {
    console.log(this.props)
    return (
      <Grid container justify="center">
        <h1>The Villains</h1>
        <Grid
          container
          direction="row"
          spacing={24}
          style={{
            justifyContent: 'center',
            alignItems: 'stretch'
          }}
        >
          {this.props.villains.length &&
            this.props.villains.map(villain => {
              return (
                <div key={villain.id} className="hero">
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
                      <h3>{villain.name}</h3>
                      <img src={villain.img} width="200px" />
                      <p>{villain.blurb}</p>
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
  return {villains: state.characters}
}

const mapDispatchtoProps = dispatch => {
  return {
    populateVillains: () => dispatch(getVillainsThunk())
  }
}

const connectedVillains = connect(mapStatetoProps, mapDispatchtoProps)(Villains)

export default connectedVillains
