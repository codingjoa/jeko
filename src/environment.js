// pman-only
const path = require('path');
const ROOT = process.cwd();
const kakao = process.env.APIKEY_KAKAO && require(path.join(ROOT, process.env.APIKEY_KAKAO));
const APIKEY_KAKAO = kakao?.apiKey;
const CALLBACK_KAKAO = kakao?.callbackURI;
const FRONT_DOMAIN = process.env.FRONT_DOMAIN ?? 'localhost';
module.exports = {
  APIKEY_KAKAO, CALLBACK_KAKAO, FRONT_DOMAIN,
};
