import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Autocomplete from 'react-google-autocomplete';

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      city: 'Stockholm',
      state: null,
      country: 'Sweden'
    }
  }
  render() {
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
                      country: value
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
              console.log(this.state);
            }
          }}
          types={['(cities)']}
        />
        </div>
      </main>
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
