const express = require('express');
const loader = require('../loader');
module.exports = (builder, errorSetup) => {
  const app = express();

  // secure
  require('./secure.proxy')(app);
  require('./secure.cors')(app);
  require('./secure.jwt')(app);
  require('./secure.session')(app);

  // parser
  const bodyParser = require('body-parser');
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: false,
    limit: '64mb',
  }));
  const cookieParser = require('cookie-parser');
  app.use(cookieParser());

  // endpoint
  const errors = builder(loader(app));

  // error-handle
  app.use(
    require('./errorHandlar')(errorSetup)
  );

  return app;
};
