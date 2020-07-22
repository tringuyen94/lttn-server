const multer = require("multer")
const mkdirp = require("mkdirp")

const uploadImage = type => {
  mkdirp(`uploads/${type}`, err => {
    if (err) return console.log(err)
  })
  const storage = multer.diskStorage({
    destination: function(req, res, cb) {
      cb(null, `uploads/${type}`)
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + "_" + file.originalname)
    }
  })
  const upload = multer({ storage })

  return upload.single(type)
}
module.exports = uploadImage
