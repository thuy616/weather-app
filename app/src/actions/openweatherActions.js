import * as actions from './types';
import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY || '170e418d376d5e183569155a8ff23e02';
const apiUri = 'http://api.openweathermap.org/data/2.5/weather';

axios.host = 'http://api.openweathermap.org'

export function fetchOpenWeatherConditions(countryCode, cityName) {
  return dispatch => {
    const url = `${apiUri}?q=${cityName},${countryCode}&appid=${API_KEY}`;
    return axios.get(url)
    .then(response => {
      if (response.status === 200) {
        const data = response.data.main;
        dispatch({
          type: actions.FETCH_OPENWEATHER_DATA,
          payload: data
        });
      }
    })
    .catch(err => {
      console.error('err', err);
      const message = `Openweather API Error: ${err.message}`
      dispatch({
        type: actions.FETCH_OPENWEATHER_ERROR,
        payload: new Error(message)
      })
    })
  }
}
