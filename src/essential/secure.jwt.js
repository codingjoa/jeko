const { JWT } = require('./env');
const jwt = require('express-jwt');
module.exports = function Jwt(app) {
  if(!JWT) {
    return;
  }
  app.use(jwt({
    secret: 'development',
    algorithms: ['HS256'],
    credentialsRequired: false
  }));
}
