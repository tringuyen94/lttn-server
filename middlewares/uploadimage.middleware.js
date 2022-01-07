const multer = require("multer")

const uploadImage = type => {
  const storage = multer.diskStorage({
    destination: function (req, res, cb) {
      cb(null, `uploads/${type}`)
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })
  const upload = multer({ storage })
  if (type == 'projectThumb') return upload.single(type)
    return upload.array(type)
}



module.exports = uploadImage
