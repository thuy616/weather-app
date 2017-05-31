import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import * as actions from '../actions/types';
import openweatherReducer from './openweatherReducer';
import wundergroundReducer from './wundergroundReducer';

// top lever reducer
const appReducer = combineReducers({
  routing: routerReducer,
  openweather: openweatherReducer,
  wunderground: wundergroundReducer
});

export default appReducer;
