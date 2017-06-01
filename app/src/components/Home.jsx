import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Autocomplete from 'react-google-autocomplete';
import { Row, Col } from 'react-bootstrap';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      city: 'Stockholm',
      state: null,
      country: 'Sweden',
      countryCode: 'SE'
    }
  }

  componentWillMount() {
    this.props.fetchWundergroundConditions(this.state.country, this.state.countryCode, this.state.city);
    this.props.fetchOpenWeatherConditions(this.state.countryCode, this.state.city);
  }

  render() {
    const { openweatherData, wundergroundData, error } = this.props;
    return (
      <main className="main">
        <div className="search-container">
          <Autocomplete
            className="search-bar"
            placeholder={`${this.state.city}, ${this.state.country}` }
            onPlaceSelected={(place) => {
              console.log('selected place', place);
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
            <Col sm={4} className="box-data-container">
              <div className="box-label"><a target="_blank" href="https://www.wunderground.com/weather/api/d/docs"><h4>Wunderground API</h4></a></div>
              <div className='box-data'><p className="data">test1</p></div>
            </Col>
            <Col sm={4} className="box-data-container">
              <div className="box-label"><h4>Average</h4></div>
              <div className='box-data'><p className="data">test2</p></div>
              </Col>
            <Col sm={4} className="box-data-container">
              <div className="box-label"><a target="_blank" href="https://openweathermap.org/api"><h4>Openweather API</h4></a></div>
              <div className='box-data'><p className="data">test3</p></div>
            </Col>
          </Row>
        </div>
      </main>
    )
  }
}

function mapStateToProps(state) {
  return {
    wundergroundData: state.wunderground.results,
    openweatherData: state.openweather.results,
    error: state.wunderground.error || state.openweather.error
  }
}

export default connect(mapStateToProps, actions)(Home);
