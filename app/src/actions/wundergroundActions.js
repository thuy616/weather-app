import * as actions from './types';
import axios from 'axios';
import _ from 'lodash';

const API_KEY = process.env.WUNDERGROUND_API_KEY || `18ecac6602ea1bc4`;
const apiUri = `http://api.wunderground.com/api/${API_KEY}/conditions/q`;

export function fetchWundergroundConditions(country, countryCode, city) {
  let currentObservation;
  let preciseCityUrl;
  return dispatch => {
    const url = `${apiUri}/${country}/${city}.json`;
    return axios({
      method: 'GET',
      url: url
    })
    .then(response => {
      if (response.status === 200) {
        const data = response.data;
        if (data.current_observation) {
          currentObservation = data.current_observation;
        } else {
          // ambiguous name, an array of cities with additional data is returned
          // another request with more precise query should be made
          const preciseCity = _.first(_.filter(data.response.results, {'country_iso3166': countryCode}));
          if (preciseCity) {
            const zmw = preciseCity.zmw;
            preciseCityUrl = `${apiUri}/zmw:${zmw}.json`;
          } else {
            currentObservation = null;
          }
        }
      }
    })
    .then(() => {
      if (preciseCityUrl) {
        return axios({
          method: 'GET',
          url: preciseCityUrl
        })
      } else {
        return Promise.resolve();
      }
    })
    .then(response => {
      if (response && response.status == 200) {
        currentObservation = response.data.current_observation;
      }
    })
    .then(() => {
      dispatch({
        type: actions.FETCH_WUNDERGROUND_DATA,
        payload: currentObservation
      })
    })
    .catch (err => {
      const message = `Wunderground API Error: ${err.message}`;
      dispatch({
        type: actions.FETCH_WUNDERGROUND_ERROR,
        payload: new Error(message)
      })
    })
  }
}
