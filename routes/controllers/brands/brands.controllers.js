const { default: slugify } = require("slugify")
const Brand = require("../../../models/brand.model")


const createBrand = (req, res, next) => {
  const { nameBrand } = req.body
  const slug = slugify(nameBrand, { lower: true })
  Brand.findOne({ nameBrand })
    .then((brand) => {
      if (brand) return Promise.reject({ status: 409, message: "Tên hãng đã tồn tại" })
      let newBrand = new Brand({ nameBrand, slug })
      return newBrand.save()
    })
    .then((brand) => res.status(201).json({ brand, message: `Đã thêm ${brand.nameBrand} thành công` }))
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json({ err, message: "Thêm hãng thất bại" })
    })
}
const getBrands = (req, res, next) => {
  Brand.find()
    .then((brands) => res.status(200).json(brands))
    .catch((err) => res.status(500).json(err))
}
const updateBrandById = (req, res, next) => {
  Brand.findByIdAndUpdate(req.params, { $set: req.body }, { new: true }, function (err, result) {
    if (err) return res.status(500).json({ message: "Cập nhật thất bại" })
    return res.status(200).json({ updated: result, message: "Cập nhật thành công" })
  })
}

module.exports = {
  createBrand,
  getBrands,
  updateBrandById,
}
