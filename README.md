# WEATHER APP

### Live Demo
* The demo is live at http://my-city-guide.herokuapp.com

### Running the app locally
* Clone the Github repo `git clone https://github.com/thuy616/weather-app.git`
* Go to the folder that you just cloned, to install the dependencies, run `npm install`
* To run the app locally, run `NODE_ENV=develop GOOGLE_MAPS_API_KEY={googleKey} OPENWEATHER_API_KEY={openweatherKey} WUNDERGROUND_API_KEY={wundergroundKey} npm run develop`
* Open the web-app in the browser at http://localhost:8080
* The application is automatically rebuilt if any .jsx, .js, .sass file is changed

### Run Test
* `NODE_ENV=test GOOGLE_MAPS_API_KEY={googleKey} OPENWEATHER_API_KEY={openweatherKey} WUNDERGROUND_API_KEY={wundergroundKey} npm run test`
* Use 'moxios' to mock the responses of the external APIs
* Use jest, enzyme, redux-mock-store

### External APIs
* Wunderground Current Weather Conditions https://www.wunderground.com/weather/api/d/docs
* Openweather API https://openweathermap.org/api

### The Stack
* Server: NodeJS, HapiJS
* Client: React, Redux, redux-thunk, axios
* Unit test: jest, enzyme
* Build tools: Webpack, Gulp
* Styling: SASS
