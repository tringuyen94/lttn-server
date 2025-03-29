const USER_ROLES = ['admin', 'moderator', 'user'];

const IMAGE_LIMIT_UPLOAD = {
  product: 10,
};

const COOKIE_OPTIONS = {
  maxAge: Date.now() + 24 * 60 * 60 * process.env.COOKIE_EXPIRES,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'prod',
};
module.exports = { USER_ROLES, IMAGE_LIMIT_UPLOAD, COOKIE_OPTIONS };
