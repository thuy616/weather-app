import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { ApolloClient, createNetworkInterface } from 'react-apollo';
import * as actions from '../actions/types';
import openweatherReducer from './openweatherReducer';
import wundergroundReducer from './wundergroundReducer';
import yelpReducer from './yelpReducer';
import cookie from 'react-cookie';

const networkInterface = createNetworkInterface({
  uri: 'https://api.yelp.com/v3/graphql',
  opts: {
    mode: 'no-cors',
  }
});

networkInterface.use([{
  applyMiddleware(req, next) {
    if (!req.options.headers) {
      req.options.headers = {};  // Create the header object if needed.
    }
    // get the authentication token from local storage if it exists
    const auth = cookie.load('auth');
    const token = auth ? auth.access_token : '';
    console.log('applyMiddleware() token', token);
    req.options.headers.authorization = token ? `Bearer ${token}` : null;
    next();
  }
}]);

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
