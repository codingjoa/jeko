const env = require('./environment');
module.exports = function initSession(app) {
  const session = require('express-session');
  const sessionOption = {
    secret: 'development',
    resave: false,
    rolling: true,
    saveUninitialized: true,
    cookie: {
      //secure: (!!env.HTTPS),
      secure: true,
      maxAge: ((process.env.DEBUG === '1') ? Infinity : (1000 * 60 * 30)),
      httpOnly: true,
      sameSite: 'none',
    }
  };
  app.set('trust proxy', 1);
  app.use(session(sessionOption));
}
