# WEATHER APP

### Proxying to the external APIs
Some APIs enforce HTTP access control (CORS) policy. This means sending the requests directly from the browser coming from a different origin will result in Access-Control-Allow-Origin error: `XMLHttpRequest cannot load http://api.wunderground.com/api/{API_KEY}/conditions/q/Sweden/Stockholm.json. The 'Access-Control-Allow-Origin' header has a value 'http://www.wunderground.com' that is not equal to the supplied origin. Origin 'www.example.com' is therefore not allowed access.`
Unlike the client-side browser, the web server can request access to remote servers outside of its origin. Therefore we use proxy request as follows:
* The client-side component use 'isomorphic-fetch' to send request to the web server, e.g. GET /api/wunderground/{query}
* The webserver found matching route for `/api/wunderground` and forward the request to `ttp://api.wunderground.com/api/{API_KEY}/conditions/q/{query}`
