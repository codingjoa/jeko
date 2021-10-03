const express = require('express');
const app = express();
const env = require('./environment');

require('./init')(app);
require('./init.upload')(app);
env.PROXY && require('./init.proxy')(app);
env.JWT && require('./init.jwt')(app);
env.SESSION && require('./init.session')(app);

const loader = require('./loader');
const api = loader(app);

module.exports = api;
