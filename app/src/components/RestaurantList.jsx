import React, { Component } from 'react';
import { graphql, gql } from 'react-apollo';
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
    console.log('this.props.data', this.props.data);
    return (
      <div>
        Test
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  fetchedYelpToken: state.yelp.fetchedYelpToken
});

const SearchBusinesses = gql`
  query SearchBusinesses {
    search(term: "restaurants",
           location: "san francisco",
           limit: 9) {
      business {
        name
        rating
        review_count
        photos
        location {
          address1
          city
          state
          country
        }
      }
    }
  }
`;

RestaurantList = graphql(SearchBusinesses)(RestaurantList);
RestaurantList = connect(mapStateToProps, actions)(RestaurantList);

export default RestaurantList;
