import React, { Component } from 'react';
import { Row } from 'react-bootstrap';

export default class ErrorMessage extends Component {
  render() {
    let content = null;
    if (this.props.error !== undefined) {
      content = (
        <Row className="align-center">
          <p className="error-message">{this.props.error.message}</p>
        </Row>
      )
    }
    return content;
  }
}
