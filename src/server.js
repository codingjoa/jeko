const express = require('express');
const loader = require('./loader');
module.exports = DI => {
  const app = DI ?? express();

  // secure
  require('./temp.secure.proxy')(app);
  require('./temp.secure.cors')(app);
  require('./temp.secure.jwt')(app);
  require('./temp.secure.session')(app);

  // parser
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false,
    limit: '64mb',
  }));
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  return loader(app);
};
