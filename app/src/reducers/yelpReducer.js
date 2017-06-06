import * as actions from '../actions/types';

const initialState = {
  fetchedYelpToken: false
}

export default function(state = initialState, action) {
  switch (action.type) {
    case actions.FETCH_YELP_TOKEN:
      return { ...state, fetchedYelpToken: true }
    default:
      return state;
  }
  return state;
}
