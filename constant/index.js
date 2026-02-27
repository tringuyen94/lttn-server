const USER_ROLES = ['admin', 'moderator', 'user'];

const IMAGE_LIMIT_UPLOAD = {
  product: 10,
};

const IMAGE_CONFIG = {
  quality: 85,
  thumbnailWidth: 300,
  thumbnailQuality: 70,
};

const IMAGE_FIELDS = {
  Product: ['product_cover_image', 'product_images'],
  Category: ['category_image'],
  Project: ['project_thumbnail'],
};

const COOKIE_EXPIRES_DAYS = Number(process.env.COOKIE_EXPIRES) || 1;

const COOKIE_OPTIONS = {
  // maxAge expects milliseconds (duration), not an absolute timestamp
  maxAge: COOKIE_EXPIRES_DAYS * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: process.env.NODE_ENV === 'prod',
};

module.exports = { USER_ROLES, IMAGE_LIMIT_UPLOAD, IMAGE_CONFIG, IMAGE_FIELDS, COOKIE_OPTIONS, COOKIE_EXPIRES_DAYS };
