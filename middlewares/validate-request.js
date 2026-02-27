const Joi = require('joi');
const { BadRequestError } = require('../response/error.response');

const validateRequest =
  (schema, property = 'body') =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const message = error.details.map((detail) => detail.message).join(', ');
      return next(new BadRequestError(message));
    }

    req[property] = value;
    return next();
  };

module.exports = {
  validateRequest,
};

