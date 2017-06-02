import { fetchWundergroundConditions } from '../src/actions/wundergroundActions';
import { FETCH_WUNDERGROUND_DATA, FETCH_OPENWEATHER_ERROR } from '../src/actions/types';
import configureStore from 'redux-mock-store';
import nock from 'nock';
import thunk from 'redux-thunk';
import axios from 'axios';
import httpAdapter from 'axios/lib/adapters/http';

const WUNDERGROUND_API_KEY = process.env.WUNDERGROUND_API_KEY;
axios.defaults.adapter = httpAdapter;

describe('wundergroundActions', () => {
  let store;
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  const initialState = {
    wunderground: {
      results: null,
      error: null
    },
    openweather: {
      results: null,
      error: null
    }
  };

  beforeEach(() => {
    store = mockStore(initialState);
  });

  afterEach(() => {
    nock.cleanAll();
    store = {}
  });

  it('dispatches FETCH_WUNDERGROUND_DATA action creator when request is successful', () => {
    const country = 'Sweden';
    const countryCode = 'SE';
    const city = 'Stockholm';
    const zmw = '00000.1.02485';
    nock('http://api.wunderground.com')
    .get(`/api/${WUNDERGROUND_API_KEY}/conditions/q/${country}/${city}.json`)
    .reply(200, {
      results: [
        {
          name: "Stockholm",
          city: "Stockholm",
          state: "AB",
          country: "SN",
          country_iso3166: "SE",
          country_name: "Sweden",
          zmw: "00000.1.02485",
          l: "/q/zmw:00000.1.02485"
        }
      ]
    })
    .get(`/api/${WUNDERGROUND_API_KEY}/conditions/q/zmw:${zmw}.json`)
    .reply(200, {
      currentObservation: {
        temp_f: 50,
        temp_c: 10
      }
    });
    const expectedAction = {
      type: FETCH_WUNDERGROUND_DATA,
      payload: {
        temp_f: 50,
        temp_c: 10
      }
    }
    return store.dispatch(fetchWundergroundConditions(country, countryCode, city))
                .then(() => {
                  const actualAction = store.getActions();
                  expect(actualAction[0]).toEqual(expectedAction);
                })
  })
})
