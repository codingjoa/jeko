const { SESSION } = require('./env');
const session = require('express-session');
module.exports = function initSession(app) {
  if(!SESSION) {
    return;
  }
  const sessionOption = {
    secret: 'development',
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      secure: process.env.HTTPS==='1',
      maxAge: ((process.env.DEBUG === '1') ? Infinity : (1000 * 60 * 30)),
      httpOnly: true,
      sameSite: 'none',
    }
  };
  app.use(session(sessionOption));
}
