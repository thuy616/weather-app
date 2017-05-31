import React from 'react';
import { Grid, Row, Col, Panel, Button } from 'react-bootstrap';
import { Router, Route, Link, History } from 'react-router';

class NotFound extends React.Component {

    render() {
        return (
            <div className="abs-center wd-xl">
                <div className="text-center mb-xl">
                    <div className="text-lg mb-lg">404</div>
                    <p className="lead m0">We could not find this page.</p>
                    <p>The page you are looking for does not exists.</p>
                </div>
                <ul className="list-inline text-center text-sm mb-xl">
                    <li><Link to="/" className="text-muted">Go to Home</Link></li>
                    <li className="text-muted">|</li>
                    <li><Link to="/submenu" className="text-muted">Sub Menu</Link></li>
                </ul>
            </div>
            );
    }
}

export default NotFound;
