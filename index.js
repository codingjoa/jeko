const app = require('./src/server');
const env = require('./src/environment');
const maria = require('./src/database');
const Error = require('./src/Types/Error');
module.exports = {
  app,
  env,
  maria,
  Error
};
