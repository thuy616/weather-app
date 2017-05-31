import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';

class Home extends Component {
  render() {
    return (
      <div>
        <h1>Weather App</h1>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    wundergroundResults: state.wunderground.results,
    openweatherResults: state.openweather.results,
    error: state.wunderground.error || state.openweather.error
  }
}

export default connect(mapStateToProps, actions)(Home);
