import * as actions from './types';
import axios from 'axios';

const API_KEY = process.env.OPENWEATHER_API_KEY || `170e418d376d5e183569155a8ff23e02`;
const apiUri = `http://api.openweathermap.org/data/2.5/weather`

export function fetchOpenWeatherConditions(countryCode, cityName) {
  return dispatch => {
    const url = `${apiUri}?q=${cityName},${countryCode}&appid=${API_KEY}`;
    return axios({
      method: 'GET',
      url: url
    })
    .then(response => {
      if (response.status === 200) {
        const data = response.data.main;
        console.log('openweather data', data);
        dispatch({
          type: actions.FETCH_OPENWEATHER_DATA,
          payload: data
        });
      } else {
        // dispatch error
        // TODO:
        const message = "Failed to fetch data";
        return Promise.reject(new Error(message));
      }
    })
    .catch(err => {
      dispatch({
        type: actions.FETCH_OPENWEATHER_ERROR,
        payload: err
      })
    })
  }
}
