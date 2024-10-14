const multer = require('multer');
const { BadResquestError } = require('../response/error.response');

const checkFileTyped = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'image') {
    return cb(null, true);
  } else {
    cb(new BadResquestError('File tải lên phải có định dạng ảnh'), false);
  }
};
module.exports = multer({
  storage: multer.memoryStorage(),
  fileFilter: checkFileTyped,
});
