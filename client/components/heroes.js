import React, {Component} from 'react'
import {connect} from 'react-redux'
import {getHeroesThunk} from '../store/characterReducer'

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
                <img src={hero.img} width="200px" />
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
