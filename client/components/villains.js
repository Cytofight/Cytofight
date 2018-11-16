import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getVillainsThunk} from '../store/characterReducer'

class Villains extends Component {
  componentDidMount() {
    this.props.populateVillains()
  }

  render() {
    console.log(this.props)
    return (
      <div id="villainPage">
        <h1>The Villains</h1>
        {this.props.villains.length &&
          this.props.villains.map(villain => {
            return (
              <div key={villain.id} className="hero">
                <h3>{villain.name}</h3>
                <img src={villain.img} width="200px" />
                <p>{villain.blurb}</p>
              </div>
            )
          })}
      </div>
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
