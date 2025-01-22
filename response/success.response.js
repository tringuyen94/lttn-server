'use strict';
const { StatusCodes } = require('./status-reasonphrase/httpStatusCode');

const SUCCESS_MESSAGE = {
  OK: 'Success',
  CREATED: 'Created',
};

class SuccessResponse {
  constructor({
    message,
    reasonStatusCode = SUCCESS_MESSAGE.OK,
    statusCode = StatusCodes.OK,
    metadata = {},
    res,
  }) {
    this.message = message ? message : reasonStatusCode;
    this.statusCode = statusCode;
    this.metadata = metadata;
    this.res = res;
    this.send();
  }
  send(header = {}) {
    return this.res.status(this.statusCode).json({
      message: this.message,
      metadata: this.metadata,
    });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = SUCCESS_MESSAGE.CREATED,
    metadata,
    options = {},
    res,
  }) {
    super({ message, statusCode, reasonStatusCode, metadata, res, options });
    this.options = options;
  }
}
module.exports = {
  CREATED,
  SuccessResponse,
};
