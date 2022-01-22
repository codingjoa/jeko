const cors = require('cors');
const path = require('path');
const { ROOT, CORS } = require('./env');
const whitelist = CORS && require(path.join(ROOT, CORS));
module.exports = function Cors(app) {
  if(whitelist) {
    app.use(cors((req, callback) => {
      if(whitelist.indexOf(req.header('Origin')) !== -1) {
        callback(null, { origin: true, credentials: true, maxAge: 3600 });
      } else {
        callback(null, { origin: false });
      }
    }));
  }
}
