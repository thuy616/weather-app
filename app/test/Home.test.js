import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Home from '../src/components/Home';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';

describe('connected Home Component', () => {
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
  const mockStore = configureStore();
  let store,container;

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<Home store={store} /> )
  });
  it('renders component without exploding', () => {
    expect(container.length).toEqual(1);
  });

});
