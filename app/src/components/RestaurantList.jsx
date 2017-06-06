import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { connect } from 'react-redux';
import * as actions from '../actions';
import cookie from 'react-cookie';

class RestaurantList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      accessToken: ''
    }
  }

  componentWillMount() {
    this.props.fetchYelpAccessToken();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.fetchYelpAccessToken != nextProps.fetchedYelpToken) {
      const token = cookie.load('auth').access_token;
      this.setState({
        accessToken: token
      }, () => {
        console.log('accessToken', this.state.accessToken);
      });
    }
  }

  render() {
    return (
      <div>
        Test
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  fetchedYelpToken: state.yelp.fetchedYelpToken
})

export default connect(mapStateToProps, actions)(RestaurantList);
