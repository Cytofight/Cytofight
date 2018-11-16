import axios from 'axios'

// initial state
const initialState = {}
//actions
const GET_HEROES = 'GET_HEROES'
const GET_VILLAINS = 'GET_VILLAINS'

//action creators
const getHeroes = heroes => ({type: GET_HEROES, heroes})
const getVillains = villains => ({type: GET_VILLAINS, villains})

//thunks
export const getHeroesThunk = () => {
  return async dispatch => {
    const heroesObj = await axios.get('/api/character_routes/heroes')
    const heroes = heroesObj.data
    console.log('here are my heroes:', heroes)
    dispatch(getHeroes(heroes))
  }
}

export const getVillainsThunk = () => {
  return async dispatch => {
    const villainsObj = await axios.get('/api/character_routes/villains')
    const villains = villainsObj.data
    dispatch(getVillains(villains))
  }
}

//reducer

const characterReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HEROES:
      return action.heroes
    case GET_VILLAINS:
      return action.villains
    default:
      return state
  }
}

export default characterReducer
