const Joi = require('joi');

const username = Joi.string().trim().min(3).max(50).required();
const password = Joi.string().min(8).max(100).required();

const signupSchema = Joi.object({
  username,
  password,
});

const signinSchema = Joi.object({
  username,
  password: Joi.string().required(),
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: password,
  confirmedPassword: Joi.string().required(),
});

module.exports = {
  signupSchema,
  signinSchema,
  changePasswordSchema,
};

