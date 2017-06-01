import {Server} from "hapi";
import h2o2 from "h2o2";
import inert from "inert";
import React from "react";
import ReactDOM from "react-dom/server";
import {RouterContext, match} from "react-router";
import configureStore from "./store.js";
import {Provider} from "react-redux";
import routesContainer from "./routes";
import url from "url";
import Wreck from "wreck";
import DocumentTitle from "react-document-title";
import _ from 'lodash';
import fs from 'fs';

let routes = routesContainer; // make a copy so that it's writable, routesContainer is read-only
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyDRTSaX6Rc3BG6bFyzpH9RTvGPn3V3rrDA'; // test API key
/**
 * Create Redux store, and get intitial state.
 */
const store = configureStore();
const initialState = store.getState();

/**
 * Start Hapi server
 */
const port = process.env.PORT || 8080
const server = new Server({
  connections: {
    router: {
      stripTrailingSlash: true
    }
  }
});
if (process.env.NODE_ENV === "production") {
  server.connection({port: port});
} else {
  server.connection({host: "localhost", port: port});
}
server.register([
  h2o2, inert
  // WebpackPlugin
], (err) => {
  if (err) {
    throw err;
  }

  server.start(() => {
    console.info("==> ✅  Server is listening");
    console.info("==> 🌎  Go to " + server.info.uri.toLowerCase());
  });
});

/**
 * Attempt to serve static requests from the public folder.
 */
server.route({
  method: '*',
  path: '/{params*}',
  handler: (request, reply) => {
    reply.file('dist' + request.path);
  }
});

/**
 * Catch dynamic requests here to fire-up React Router.
 */

server.ext("onPreResponse", (request, reply) => {
  if (typeof request.response.statusCode !== "undefined") {
    return reply.continue();
  }

  if (request.path.match(/\/(api.+)/)) {
    return reply.continue();
  }

  match({
    routes: routes,
    location: request.path
  }, (error, redirectLocation, renderProps) => {
    if (redirectLocation) {
      reply.redirect(redirectLocation.pathname + redirectLocation.search);
      return;
    }
    if (error || !renderProps) {
      reply.continue();
      return;
    }
    const reactString = ReactDOM.renderToString(
      <Provider store={store}>
        <RouterContext {...renderProps}/>
      </Provider>
    );
    const webserver = process.env.NODE_ENV === "production"
      ? ""
      : `//localhost:${port}`;
    const title = DocumentTitle.rewind() || 'Weather App';
    let output = (`<!doctype html>
    <html lang="en-us">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
        <meta name="description" content="weather forecast">
        <meta name="keywords" content="weather forecast">
        <title>${title}</title>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
        <link rel="stylesheet" href="${webserver}/css/main.css"/>
        <link rel="icon" href="${webserver}/img/favicon.ico"/>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
      </head>
      <body>
        <div id="app">${reactString}</div>
        <script>
          window.__INITIAL_STATE__ = ${JSON.stringify(initialState)}
          window.__UA__ = ${JSON.stringify(request.headers['user-agent'])}
        </script>
        <script src="${webserver}/js/app.bundle.js"></script>
      </body>
    </html>`);
    reply(output);
  });
});

module.exports = server;
