module.exports = function initProxy(app) {
  const corsWhitelist = require('./environment').corsWhitelist;
  const cors = require('cors');
  app.set('trust proxy', 1);
  if(corsWhitelist) {
    app.use(cors((req, callback) => {
      if(corsWhitelist.indexOf(req.header('Origin') !== -1)) {
        callback(null, { origin: true });
      } else {
        callback(null, { origin: false });
      }
    }));
  } else {
    app.use(cors());
  }
}
