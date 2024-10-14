const User = require('../models/user.model');
const {
  BadResquestError,
  AuthFailureError,
} = require('../response/error.response');
const { SuccessResponse, CREATED } = require('../response/success.response');
const asyncHandler = require('../utils/async-handler');
const { generateJWT } = require('../utils/auth-utils');

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

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new AuthFailureError('Sai mật khẩu');

  //3. Send Token
  const token = generateJWT(user._id);
  return res
    .status(200)
    .cookie('jwt', token, {
      expires: new Date(
        Date.now() + 24 * 60 * 60 * 1000 * process.env.COOKIE_EXPIRES
      ),
      secure: process.env.NODE_ENV === 'prod' ? true : false,
      httpOnly: true,
    })
    .json({
      message: 'Đăng nhập thành công',
      token,
    });
});

module.exports = {
  signup,
  signin,
};
