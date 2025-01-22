const USER_ROLES = ['admin', 'moderator', 'user'];
const IMAGE_LIMIT_UPLOAD = {
  product: 10,
};
const COOKIE_OPTIONS = {
  expires: new Date(
    Date.now() + 24 * 60 * 60 * 1000 * process.env.COOKIE_EXPIRES
  ),
  httpOnly: true,
};
module.exports = { USER_ROLES, IMAGE_LIMIT_UPLOAD, COOKIE_OPTIONS };
