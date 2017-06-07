import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import configureStore from "./store.js";
import { client } from './reducers';
import { syncHistoryWithStore } from 'react-router-redux';
import cookie from 'react-cookie';

import NotFound from './components/NotFound';
import BasePage from './components/Main';
import Home from './components/Home';
import RestaurantList from './components/RestaurantList';

const auth = cookie.load('auth');
const token = auth ? auth.access_token : '';

console.log('client.js token:', token);

const store = configureStore(window.__INITIAL_STATE__);
delete window.__INITIAL_STATE__;
const reactRoot = document.getElementById('app');

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <Router history={history}>
      <Route path="/restaurants" component={RestaurantList}>
      </Route>
    </Router>
  </ApolloProvider>,
  reactRoot
);

if (process.env.NODE_ENV !== "production") {
  if (!reactRoot.firstChild || !reactRoot.firstChild.attributes ||
      !reactRoot.firstChild.attributes["data-react-checksum"]) {
    console.error("Server-side React render was discarded. Make sure that your initial render does not contain any client-side code.");
  }
}
