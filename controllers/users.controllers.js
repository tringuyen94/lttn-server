const User = require('../models/user.model');
const { SuccessResponse } = require('../response/success.response');
const asyncHandler = require('../utils/async-handler');

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
