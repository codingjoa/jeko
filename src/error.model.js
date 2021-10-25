function ErrorModel() {
  this.errors = new Set();
}
ErrorModel.prototype.addErrorType = function addErrorType(CommonError, {
  status = 500,
  message = err => err.message,
  ticket = false,
}) {
/*
  if(errors.has(CommonError)) {
    throw new Error('Conflict Error');
  }
*/
  this.errors.add({
    CommonError,
    status,
    message,
    ticket
  });
  return this;
}

const crypto = require('crypto');
ErrorModel.getErrorTicket = function getErrorTicket(err) {
  const sha = crypto.createHash('sha256').update(err.toString()).digest('hex');
  const P = Number.parseInt(sha.substring(62), '16');
  const N = Math.floor(P / 16) * 4;
  const ticket = sha.substring(N-8, N);
  return ticket;
}

ErrorModel.prototype.toJSON = function toJSON(err) {
  try {
    for(const { CommonError, status, message } of this.errors) {
      if(err instanceof CommonError) {
        return {
          status: (status instanceof Function) ? status(err) : Number(status),
          message: (message instanceof Function) ? message(err) : `${message}`
        };
      }
    }
  } catch(err) {
    console.error(err);
  }
  const ticket = ErrorModel.getErrorTicket(err);
  return {
    status: 500,
    message: `예기치 못한 오류입니다. [${ticket}]`,
    ticket
  };
}
ErrorModel.prototype.getErrorHandlar = function getErrorHandlar() {
  return (err, req, res, next) => {
    console.error(err);
    if(res.headerSent) {
      return next(err);
    }
    try {
      const schema = this.toJSON(err);
      res.status(schema.status);
      res.json(schema);
      next();
    } catch(err) {
      return next(err);
    }
  };
}

async function createTicket(err, ticket) {

}

module.exports = ErrorModel;
module.id === require.main.id && (async () => {
  const errorModel = new ErrorModel();
/*
  errorModel.addErrorType(Error, {
    status: 400
  })
*/
  return errorModel.toJSON(new Error());
})().then(console.error);
