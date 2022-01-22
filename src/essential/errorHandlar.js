class Model {
  constructor() {
    this.errors = new Set();
  }

  addErrorType(CommonError, {
    status = 500,
    message = err => err.message,
    ticket = false,
  }) {
    this.errors.add({
      CommonError,
      status,
      message,
      ticket
    });
    return this;
  }

  handle(err) {
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
    return {
      status: 500,
      message: `예기치 못한 오류입니다.`,
      ticket
    };
  }
}

function errorHandlar(callback) {
  const model = new Model();
  callback(model);
  return (err, req, res, next) => {
    if(res.headerSent) {
      return next(err);
    }
    try {
      const schema = model.handle(err);
      res.status(schema.status);
      res.json(schema);
      console.error(err);
      return next();
    } catch(err) {
      return next(err);
    }
  }
}

module.exports = errorHandlar;
