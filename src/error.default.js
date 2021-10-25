const { CommonError, ForbiddenError, NotFoundError, UnauthorizationError } = require('./Types/Error');
const ErrorModel = require('./error.model');
const defaultModel = new ErrorModel();
defaultModel.addErrorType(CommonError, {
  status: 400
})
.addErrorType(ForbiddenError, {
  status: 403
})
.addErrorType(NotFoundError, {
  status: 404
})
.addErrorType(UnauthorizationError, {
  status: 401
});
module.exports = defaultModel;
