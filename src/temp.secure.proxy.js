const path = require('path');
const { ROOT, PROXY } = require('./env');
const whitelist = PROXY && require(path.join(ROOT, PROXY));
module.exports = function Proxy(app) {
  if(whitelist) {
    app.set('trust proxy', ip => {
      return !!whitelist.indexOf(ip);
    });
  }
}
