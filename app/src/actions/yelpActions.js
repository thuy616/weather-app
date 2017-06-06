import * as actions from './types';
import fetch from 'isomorphic-fetch';
import cookie from 'react-cookie';

let apiUri;

if (process.env.NODE_ENV === 'develop' || process.env.NODE_ENV === 'test') {
  apiUri = `http://localhost:8080/api/yelp`;
} else {
  apiUri = `http://my-city-guide.herokuapp.com`;
}

const YELP_CLIENT_ID = process.env.YELP_CLIENT_ID;
const YELP_CLIENT_SECRET = process.env.YELP_CLIENT_SECRET;

const bodyString = `grant_type=client_credentials&client_id=${YELP_CLIENT_ID}&client_secret=${YELP_CLIENT_SECRET}`;
export function fetchYelpAccessToken() {
  return dispatch => {
    const url = `${apiUri}/oauth2/token`;
    return fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
      },
      body: bodyString
    })
    .then(response => response.json())
    .then(body => {
      if (body.statusCode === 200) {
        const data = body.data;
        cookie.save('auth', data, {path: '/'});
        dispatch({
          type: actions.FETCH_YELP_TOKEN
        })
      }
    })
    .catch(err => {
      console.log('err', err);
      const message = `Yelp API Error: ${err.message}`
      dispatch({
        type: actions.FETCH_YELP_TOKEN_ERROR,
        payload: new Error(message)
      })
    })
  }
}
