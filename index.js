const app = require('./src/server');
const env = require('./src/environment');
const maria = require('./src/database');
const DAO = require('./src/dao');
const Error = require('./src/Types/Error');
module.exports = {
  app,
  env,
  maria,
  Error,
  DAO
};
