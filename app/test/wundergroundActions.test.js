import { fetchWundergroundConditions } from '../src/actions/wundergroundActions';
import { FETCH_WUNDERGROUND_DATA, FETCH_WUNDERGROUND_ERROR } from '../src/actions/types';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import moxios from 'moxios';

const WUNDERGROUND_API_KEY = process.env.WUNDERGROUND_API_KEY;

describe('wundergroundActions async', () => {
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

  it('dispatches FETCH_WUNDERGROUND_DATA action creator when request is successful', () => {
    moxios.stubRequest(/http:\/\/api.wunderground.com\/api\/*/, {
      status: 200,
      response: {
        current_observation: {
          temp_f: 50,
          temp_c: 10
        }
      }
    });
    const expectedAction = {
      type: FETCH_WUNDERGROUND_DATA,
      payload: {
        temp_f: 50,
        temp_c: 10
      }
    }
    return store.dispatch(fetchWundergroundConditions('France', 'FR', 'Paris'))
                .then(() => {
                  expect(store.getActions()[0]).toEqual(expectedAction);
                });
  });

  it('dispatches FETCH_WUNDERGROUND_ERROR action creator when request falis', () => {
    moxios.stubRequest(/http:\/\/api.wunderground.com\/api\/*/, {
      status: 500,
      response: {
        message: 'some message'
      }
    });
    const expectedAction = {
      type: FETCH_WUNDERGROUND_ERROR,
      payload: new Error('Wunderground API Error: Request failed with status code 500')
    }
    return store.dispatch(fetchWundergroundConditions('France', 'FR', 'Paris'))
                .then(() => {
                  expect(store.getActions()[0]).toEqual(expectedAction);
                });
  });
});
