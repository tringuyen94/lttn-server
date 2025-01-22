'use strict';
const {
  ReasonPhrases,
  StatusCodes,
} = require('./status-reasonphrase/httpStatusCode');

class ErrorReponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// class ErrorResponse extends Error {
//   constructor(mesasge, statusCode) {
//     super(mesasge);
//     this.statusCode = statusCode;
//     this.status = `${String(statusCode).startsWith(4) ? 'fail' : 'error'}`;
//     this.isOperational = true;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }

class BadResquestError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    statusCode = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode);
  }
}
class ConflictRequestError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.CONFLICT,
    statusCode = StatusCodes.CONFLICT
  ) {
    super(message, statusCode);
  }
}
class AuthFailureError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    statusCode = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode);
  }
}

class NotFoundError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    statusCode = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode);
  }
}

class ForbiddenError extends ErrorReponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    statusCode = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode);
  }
}

module.exports = {
  BadResquestError,
  ConflictRequestError,
  AuthFailureError,
  NotFoundError,
  ForbiddenError,
};
