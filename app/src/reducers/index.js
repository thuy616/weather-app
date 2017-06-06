import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import * as actions from '../actions/types';
import openweatherReducer from './openweatherReducer';
import wundergroundReducer from './wundergroundReducer';
import yelpReducer from './yelpReducer';

const networkInterface = createNetworkInterface({
  uri: 'https://api.yelp.com/v3/graphql'
});

export const client = new ApolloClient({
  networkInterface: networkInterface
});

// top lever reducer
const appReducer = combineReducers({
  routing: routerReducer,
  apollo: client.reducer(),
  openweather: openweatherReducer,
  wunderground: wundergroundReducer,
  yelp: yelpReducer
});

export default appReducer;
