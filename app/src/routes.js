import React from 'react';
import { Router, browserHistory, Route, IndexRoute, IndexRedirect } from 'react-router';
import NotFound from './components/NotFound';
import BasePage from './components/Main';
import Home from './components/Home';

export default (
  <Router>

    <Route path="/" component={BasePage}>
      {/* Default route*/}
      <IndexRoute component={Home}/>
    </Route>

    <Route path="*" component={NotFound} />

  </Router>
);
