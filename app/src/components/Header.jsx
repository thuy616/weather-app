import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Header extends Component {
  render() {
    return (
      <header className="header">
        <div className="holder-panel-header">
          <div className="logo">
            <Link to="/"><img style={{ height:'37px'}} src="/img/logo.png" alt="Detour Logo" height="37"/></Link>
          </div>
          <p className="app-title">Temperature</p>
        </div>
      </header>
    )
  }
}
