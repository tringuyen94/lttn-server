const { Image } = require("../../../models/image.model")

const uploadImage = (req, res, next) => {
  const path = req.file.path
  const newImage = new Image({ path })
  return newImage
    .save()
    .then(image => res.status(201).json(image))
    .catch(err => res.status(500).json(err))
}
const getImages = (req, res, next) => {
  Image.find()
    .then(images => res.status(200).json(images))
    .catch(err => res.status(500).json(err))
}
const getImageById = (req, res, next) => {
  const imageId = req.params
  Image.findById(imageId)
    .then(image => {
      if (!image) return Promise.reject({ status: 404, message: "Not found" })
      return res.status(200).json(image)
    })
    .catch(err => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}

module.exports = {
  uploadImage,
  getImages,
  getImageById
}
