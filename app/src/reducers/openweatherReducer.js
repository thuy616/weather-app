import * as actions from '../actions/types';

const initialState = {
  results: 'initial',
  error: null
}

export default function(state=initialState, action) {
  switch (action.type) {
    case actions.FETCH_OPENWEATHER_DATA:
      return {...state, results: action.payload }
    case actions.FETCH_OPENWEATHER_ERROR:
      return {...state, error: action.payload }
    default:
      return state;
  }
  return state;
}
