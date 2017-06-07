require("babel-polyfill");
require("babel-core/register")({
  presets: ["es2015", "stage-2", "react"],
  "plugins": ["transform-decorators-legacy", "transform-class-properties"]
});
/**
 * Define isomorphic constants.
 */
global.__CLIENT__ = false;
global.__SERVER__ = true;

global.process.env.NODE_ENV = process.env.NODE_ENV || "development";
global.process.env.OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
global.process.env.WUNDERGROUND_API_KEY = process.env.WUNDERGROUND_API_KEY;

if (process.env.NODE_ENV !== "production") {
  if (!require("piping")({hook: true, includeModules: false})) {
    return;
  }
}
try {
  require("./app/src/server");
} catch (error) {
  console.error(error.stack || error);
}
