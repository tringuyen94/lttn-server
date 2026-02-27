const multer = require('multer');
const { BadRequestError } = require('../response/error.response');

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    return cb(null, true);
  } else {
    cb(new BadRequestError('Uploaded file must be an image'), false);
  }
};
module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB per file
});
