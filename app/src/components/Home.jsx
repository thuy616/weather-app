import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Autocomplete from 'react-google-autocomplete';
import { Row, Col } from 'react-bootstrap';
import ErrorMessage from './ErrorMessage';
import RestaurantList from './RestaurantList';

export class HomeComponent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      city: 'Stockholm',
      state: null,
      country: 'Sweden',
      countryCode: 'SE',
      unit: 'C'
    }
  }

  componentWillMount() {
    this.props.fetchWundergroundConditions(this.state.country, this.state.countryCode, this.state.city);
    this.props.fetchOpenWeatherConditions(this.state.countryCode, this.state.city);
  }

  calculateAverage(value1, value2) {
    const num1 = Number(value1);
    const num2 = Number(value2);
    if (!isNaN(num1) && !isNaN(num2)) {
      return ((num1 + num2)/2).toFixed(1);
    } else {
      if (isNaN(num1)) {
        return num2;
      } else if (isNaN(num2)) {
        return num1;
      } else if (isNaN(num1) && isNaN(num2)) {
        return '';
      }
    }
  }

  render() {
    const { openweatherData, wundergroundData, error } = this.props;
    const openweatherTemp_C = openweatherData == 'initial' ? '' : (openweatherData ? (openweatherData.temp - 273.15).toFixed(1) : 'N.A.');
    const wundergroundTemp_C = wundergroundData == 'initial' ? '' : ( wundergroundData ? wundergroundData.temp_c.toFixed(1) : 'N.A.');
    const openweatherTemp_F = openweatherData == 'initial' ? '' : (openweatherData ? (9/5*(openweatherData.temp - 273.15) + 32).toFixed(1) : 'N.A.');
    const wundergroundTemp_F = wundergroundData == 'initial' ? '' : (wundergroundData ? wundergroundData.temp_f.toFixed(1) : 'N.A.');

    let avg_C = this.calculateAverage(openweatherTemp_C, wundergroundTemp_C);
    let avg_F = this.calculateAverage(openweatherTemp_F, wundergroundTemp_F);

    return (
      <main className="main">
        <div className="search-container">
          <Autocomplete
            className="search-bar"
            placeholder={`${this.state.city}, ${this.state.country}` }
            onPlaceSelected={(place) => {
              if (place.address_components.length > 0) {
                for (let i = 0; i < place.address_components.length; i++) {
                  const addressType = place.address_components[i].types[0];
                  const value = place.address_components[i].long_name;
                  switch(addressType) {
                    case 'country':
                      this.setState({
                        country: value,
                        countryCode: place.address_components[i].short_name
                      })
                      break;
                    case 'administrative_area_level_1':
                      this.setState({
                        state: value
                      })
                      break;
                    case 'locality':
                      this.setState({
                        city: value
                      })
                      break;
                  }
                }
                this.props.fetchWundergroundConditions(this.state.country, this.state.countryCode, this.state.city);
                this.props.fetchOpenWeatherConditions(this.state.countryCode, this.state.city);
              }
            }}
            types={['(cities)']}
          />
        </div>
        <div className="temp-container">
          <Row>
            <div className="align-center bold font-24">
              <a href="#" onClick={event => {
                event.preventDefault();
                this.setState({ unit: 'C' });
              }}>°C</a> / <a href="#" onClick={event => {
                event.preventDefault();
                this.setState({ unit: 'F' });
              }}>°F</a>
            </div>
          </Row>
          <Row>
            <Col sm={4} className="box-data-container">
              <div className="box-label"><a target="_blank" href="https://www.wunderground.com/weather/api/d/docs"><h4>Wunderground API</h4></a></div>
              <div className='box-data'>
                <p className="data">
                  <span className="fade-in">{this.state.unit == 'C' ? wundergroundTemp_C : wundergroundTemp_F}°</span>
                </p>
              </div>
            </Col>
            <Col sm={4} className="box-data-container">
              <div className="box-label"><h4>Average</h4></div>
              <div className='box-data'>
                <p className="data">
                  <span className="fade-in">{this.state.unit == 'C' ? avg_C : avg_F}°</span>
                </p>
              </div>
              </Col>
            <Col sm={4} className="box-data-container">
              <div className="box-label"><a target="_blank" href="https://openweathermap.org/api"><h4>Openweather API</h4></a></div>
              <div className='box-data'>
                <p className="data">
                  <span className="fade-in">{this.state.unit == 'C' ? openweatherTemp_C : openweatherTemp_F}°</span>
                </p></div>
            </Col>
          </Row>
        </div>

        <ErrorMessage error={this.props.error} />
      </main>
    )
  }
}

const mapStateToProps = (state) => ({
  wundergroundData: state.wunderground.results,
  openweatherData: state.openweather.results,
  error: state.wunderground.error || state.openweather.error || undefined
});

export default connect(mapStateToProps, actions)(HomeComponent);
