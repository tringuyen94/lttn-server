const { COOKIE_OPTIONS } = require('../constant/index.js');
const User = require('../models/user.model');
const {
  BadResquestError,
  AuthFailureError,
} = require('../response/error.response');
const { CREATED } = require('../response/success.response');
const asyncHandler = require('../utils/async-handler');
const { generateJWT } = require('../utils/auth-utils.js');
const bcrypt = require('bcryptjs');

const signup = asyncHandler(async (req, res, next) => {
  const usernameExist = await User.findOne({ username: req.body.username });
  if (usernameExist) throw new BadResquestError('Tài khoản đã tồn tại');
  new CREATED({
    message: 'Tạo tài khoản thành công',
    metadata: await User.create({
      username: req.body.username,
      password: req.body.password,
    }),
    res,
  });
});

const signin = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  //1 Check username
  const user = await User.findOne({ username }).select('password');
  if (!user) throw new BadResquestError('Tài khoản không tồn tại');
  //2. Check password

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new AuthFailureError('Sai mật khẩu');

  //3. Send Token
  const token = generateJWT(user._id);
  return res.status(200).cookie('jwt', token, COOKIE_OPTIONS).json({
    message: 'Đăng nhập thành công',
    token,
  });
});
const signout = asyncHandler(async (req, res, next) => {
  res.clearCookie('jwt');
  return res.status(200).json({ message: 'Đã đăng xuất' });
});

const checkLogged = asyncHandler(async (req, res, next) => {
  return res.status(200).json({
    status: 'success',
    user: req.user,
    message: 'session validated',
  });
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { newPassword, confirmedPassword } = req.body;
  if (newPassword !== confirmedPassword)
    throw new BadResquestError('Mật khẩu không khớp');
  const user = await User.findById(req.user._id);
  user.password = newPassword;
  await user.save();
  return res.status(200).json({
    status: 'success',
    message: 'Cập nhật mật khẩu thành công',
  });
});

module.exports = {
  signup,
  signin,
  signout,
  checkLogged,
  changePassword,
};
