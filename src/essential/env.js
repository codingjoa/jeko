const ROOT = process.cwd();
/*
EXPRESS_PROXY || PROXY
  신뢰할 proxy ip주소 파일
*/
const PROXY = process.env.EXPRESS_PROXY ?? process.env.PROXY ?? false;

/*
MIDDLEWARE_JWT || JWT
*/
const JWT = process.env.MIDDLEWARE_JWT ?? process.env.JWT ?? false;

/*
MIDDLEWARE_SESSION || SESSION
*/
const SESSION = process.env.MIDDLEWARE_SESSION ?? process.env.SESSION ?? false;

/*
MIDDLEWARE_CORS || CORS_WHITELIST
  CORS를 허용할 ip주소 파일
*/
const CORS = process.env.MIDDLEWARE_CORS ?? process.env.CORS_WHITELIST ?? false;

module.exports = {
  ROOT, PROXY, JWT, SESSION, CORS
};
