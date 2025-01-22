const User = require('../models/user.model');
const {
  AuthFailureError,
  NotFoundError,
} = require('../response/error.response');
const asyncHandler = require('../utils/async-handler');
const { verifyJWT } = require('../utils/auth-utils');

const authentication = asyncHandler(async (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) throw new AuthFailureError('Vui lòng đăng nhập');
  const { payload } = verifyJWT(token);
  const user = await User.findById(payload);
  if (!user) throw new NotFoundError('Invalid User');
  req.user = user;
  next();
});

const authorization = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.user_role)) {
      throw new AuthFailureError('Bạn không thể thực hiện thao tác này', 403);
    }
    next();
  };
};
module.exports = {
  authentication,
  authorization,
};
