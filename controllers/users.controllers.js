const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const { promisify } = require('util');
const comparePassword = promisify(bcrypt.compare);
const jsonwebtoken = require('jsonwebtoken');
const { SuccessResponse } = require('../response/success.response');
const asyncHandler = require('../utils/async-handler');
const jwtSign = promisify(jsonwebtoken.sign);

const getAllUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find();
  new SuccessResponse({
    metadata: users,
    res,
  });
});

module.exports = {
  getAllUsers,
};
