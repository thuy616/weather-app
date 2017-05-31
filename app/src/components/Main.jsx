import React, { Component } from 'react';
import Header from './Header';

export default class BasePage extends Component {
  render() {
    return (
      <div>
        <Header />
        {React.cloneElement(this.props.children)}
      </div>
    );
  }
}
