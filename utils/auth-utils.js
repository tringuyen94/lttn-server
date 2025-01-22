const jwt = require('jsonwebtoken');
const { AuthFailureError } = require('../response/error.response');

const generateJWT = (payload) => {
  const token = jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
  return token;
};
const verifyJWT = (token) => {
  let payload;
  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    // err
    if (err)
      throw new AuthFailureError(
        'Hết thời gian đăng nhập,vui lòng đăng nhập lại'
      );
    // decoded undefined
    payload = decoded;
  });
  return payload;
};
module.exports = {
  generateJWT,
  verifyJWT,
};
