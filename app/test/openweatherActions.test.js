import { fetchOpenWeatherConditions } from '../src/actions/openweatherActions';
import { FETCH_OPENWEATHER_DATA, FETCH_OPENWEATHER_ERROR } from '../src/actions/types';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

describe('openweatherActions async', () => {
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
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
    store = {}
  });

  it('dispatches FETCH_OPENWEATHER_DATA action creator when request is successful', () => {
    moxios.stubRequest(/http:\/\/api.openweathermap.org\/data\/2.5\/*/, {
      status: 200,
      response: {
        cod: 200,
        main: {
          temp: 279.62,
          pressure: 1015,
          humidity: 65,
          temp_min: 279.15,
          temp_max: 280.15
        }
      }
    });

    const expectedAction = {
      type: FETCH_OPENWEATHER_DATA,
      payload: {
        temp: 279.62,
        pressure: 1015,
        humidity: 65,
        temp_min: 279.15,
        temp_max: 280.15
      }
    }

    return store.dispatch(fetchOpenWeatherConditions('Stockholm', 'SE'))
                .then(() => {
                  expect(store.getActions()[0]).toEqual(expectedAction);
                });
  });

  it('dispatches FETCH_OPENWEATHER_ERROR action creator when request fails', () => {
    const payload = {
      cod: 401,
      message: "Invalid API key. Please see http://openweathermap.org/faq#error401 for more info."
    }
    moxios.stubRequest(/http:\/\/api.openweathermap.org\/data\/2.5\/*/, {
      status: 401,
      response: payload
    });
    const expectedAction = {
      type: FETCH_OPENWEATHER_ERROR,
      payload: new Error(`Openweather API Error: Request failed with status code 401`)
    }

    return store.dispatch(fetchOpenWeatherConditions('Stockholm', 'SE'))
                .then(() => {
                  expect(store.getActions()[0]).toEqual(expectedAction);
                });
  });
});
