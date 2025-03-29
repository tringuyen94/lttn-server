const jwt = require('jsonwebtoken');
const { AuthFailureError } = require('../response/error.response');

const generateJWT = (payload) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};
const verifyJWT = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new AuthFailureError(
      'Hết thời gian đăng nhập, vui lòng đăng nhập lại'
    );
  }
};
module.exports = {
  generateJWT,
  verifyJWT,
};
