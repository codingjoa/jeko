const app = require('./src/server');
const env = require('./src/environment');
//const maria = require('./src/database');
const DAO = require('./src/dao');
const Make2Model = require('./src/model.v2');
const FileSystem = require('./src/file');
//const Error = require('./src/Types/Error');
module.exports = {
  app,
  env,
  //maria,
  //Error,
  DAO,
  Make2Model,
  FileSystem,
};
