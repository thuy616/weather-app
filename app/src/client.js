import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory } from 'react-router';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import routes from './routes';
import configureStore from "./store.js";
import { client } from './reducers';
import { syncHistoryWithStore } from 'react-router-redux';
import cookie from 'react-cookie';

const store = configureStore(window.__INITIAL_STATE__);
delete window.__INITIAL_STATE__;
const reactRoot = document.getElementById('app');

const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <ApolloProvider store={store} client={client}>
    <Router history={history} routes={routes}>
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
