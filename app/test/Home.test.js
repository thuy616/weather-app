import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import Home, {HomeComponent} from '../src/components/Home';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

describe('Home Component - shallow rendering and initialState', () => {
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
  it('has props that matches with initialState', () => {
    expect(container.prop('openweatherData')).toEqual(initialState.openweather.results);
    expect(container.prop('wundergroundData')).toEqual(initialState.wunderground.results);
  })
});

describe('Home Component - mount and wrapping in <Provider>', () => {

  const initialState = {
    wunderground: {
      results: {
        image: {
        url: 'http://icons.wxug.com/graphics/wu2/logo_130x80.png',
        title: 'Weather Underground',
        link: 'http://www.wunderground.com'
      },
      display_location: {
        full: 'Stockholm, Sweden',
        city: 'Stockholm',
        state: 'AB',
        state_name: 'Sweden',
        country: 'SN',
        country_iso3166: 'SE',
        zip: '00000',
        magic: '1',
        wmo: '02485',
        latitude: '59.33000183',
        longitude: '18.05999947',
        elevation: '17.1'
      },
      observation_location: {
        full: 'Norr Mälarstrand, Stockholm, ',
        city: 'Norr Mälarstrand, Stockholm',
        state: '',
        country: 'SE',
        country_iso3166: 'SE',
        latitude: '59.326458',
        longitude: '18.048368',
        elevation: '52 ft'
      },
      estimated: {},
      station_id: 'ISTOCKHO432',
      observation_time: 'Last Updated on June 2, 7:11 AM CEST',
      observation_time_rfc822: 'Fri, 02 Jun 2017 07:11:27 +0200',
      observation_epoch: '1496380287',
      local_time_rfc822: 'Fri, 02 Jun 2017 07:20:08 +0200',
      local_epoch: '1496380808',
      local_tz_short: 'CEST',
      local_tz_long: 'Europe/Stockholm',
      local_tz_offset: '+0200',
      weather: 'Clear',
      temperature_string: '47.7 F (8.7 C)',
      temp_f: 47.7,
      temp_c: 8.7,
      relative_humidity: '62%',
      wind_string: 'From the SW at 3.1 MPH Gusting to 8.7 MPH',
      wind_dir: 'SW',
      wind_degrees: 236,
      wind_mph: 3.1,
      wind_gust_mph: '8.7',
      wind_kph: 5,
      wind_gust_kph: '14.0',
      pressure_mb: '1015',
      pressure_in: '29.98',
      pressure_trend: '0',
      dewpoint_string: '35 F (2 C)',
      dewpoint_f: 35,
      dewpoint_c: 2,
      heat_index_string: 'NA',
      heat_index_f: 'NA',
      heat_index_c: 'NA',
      windchill_string: '47 F (8 C)',
      windchill_f: '47',
      windchill_c: '8',
      feelslike_string: '47 F (8 C)',
      feelslike_f: '47',
      feelslike_c: '8',
      visibility_mi: 'N/A',
      visibility_km: 'N/A',
      solarradiation: '--',
      UV: '-1',
      precip_1hr_string: '-999.00 in ( 0 mm)',
      precip_1hr_in: '-999.00',
      precip_1hr_metric: ' 0',
      precip_today_string: '-999.00 in (-25375 mm)',
      precip_today_in: '-999.00',
      precip_today_metric: '--',
      icon: 'clear',
      icon_url: 'http://icons.wxug.com/i/c/k/clear.gif',
      forecast_url: 'http://www.wunderground.com/global/stations/02485.html',
      history_url: 'http://www.wunderground.com/weatherstation/WXDailyHistory.asp?ID=ISTOCKHO432',
      ob_url: 'http://www.wunderground.com/cgi-bin/findweather/getForecast?query=59.326458,18.048368',
      nowcast: ''
      },
      error: null
    },
    openweather: {
      results: {
        temp: 279.62,
        pressure: 1015,
        humidity: 65,
        temp_min: 279.15,
        temp_max: 280.15
      },
      error: null
    }
  };
  const middlewares = [thunk];
  const mockStore = configureStore(middlewares);
  let store,wrapper;

  beforeEach(()=>{
    store = mockStore(initialState)
    wrapper = mount( <Provider store={store}><Home /></Provider> )
  });
  it('renders the component', () => {
    expect(wrapper.find(Home).length).toEqual(1);
  });
  it('contains Google Places autocomplete search bar', () => {
    expect(wrapper.find('Autocomplete').length).toEqual(1);
  });
  it('contains data boxes that display the temperature', () => {
    expect(wrapper.find('.box-data').length).toEqual(3);
  });
  it('matches prop and state', () => {
    expect(wrapper.find(HomeComponent).prop('openweatherData')).toEqual(initialState.openweather.results);
    expect(wrapper.find(HomeComponent).prop('wundergroundData')).toEqual(initialState.wunderground.results);
  });
})
