const { COOKIE_OPTIONS } = require('../constant/index.js');
const User = require('../models/user.model');
const {
  BadRequestError,
  AuthFailureError,
} = require('../response/error.response');
const { CREATED } = require('../response/success.response');
const asyncHandler = require('../utils/async-handler');
const { generateJWT } = require('../utils/auth-utils.js');
const bcrypt = require('bcryptjs');

const signup = asyncHandler(async (req, res, next) => {
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) throw new BadRequestError('Account already exists');
  new CREATED({
    message: 'Account created successfully',
    metadata: await User.create({
      username: req.body.username,
      password: req.body.password,
    }),
    res,
  });
});

const signin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  // 1. Find user including password for verification
  const user = await User.findOne({ username }).select('+password');
  if (!user) throw new AuthFailureError('Account does not exist');

  // 2. Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthFailureError('Incorrect password');

  // 3. Generate token
  const token = generateJWT(user._id);

  // 4. Remove password before sending user data to client
  const userObject = user.toObject();
  delete userObject.password;

  // 5. Send token and user info
  return res.status(200).cookie('jwt', token, COOKIE_OPTIONS).json({
    message: 'Signed in successfully',
    token,
    user: userObject,
  });
});
const signout = asyncHandler(async (req, res, next) => {
  res.clearCookie('jwt');
  return res.status(200).json({ message: 'Signed out' });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword, confirmedPassword } = req.body;
  if (newPassword !== confirmedPassword)
    throw new BadRequestError('Passwords do not match');

  const user = await User.findById(req.user._id).select('+password');
  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new AuthFailureError('Current password is incorrect');

  user.password = newPassword;
  await user.save();
  return res.status(200).json({
    status: 'success',
    message: 'Password updated successfully',
  });
});
const checkLogged = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    user: req.user,
  });
});

module.exports = {
  signup,
  signin,
  signout,
  checkLogged,
  changePassword,
};
