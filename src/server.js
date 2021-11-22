const express = require('express');
const app = express();
const env = require('./environment');
const loader = require('./loader');

module.exports = DI => {
  const app = DI ?? express();
  require('./init')(app);
  require('./init.upload')(app);
  env.PROXY && require('./init.proxy')(app);
  env.JWT && require('./init.jwt')(app);
  env.SESSION && require('./init.session')(app);
  return loader(app);
};
