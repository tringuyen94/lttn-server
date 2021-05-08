const { Brand } = require("../../../models/brand.model")
const createBrand = (req, res, next) => {
  const { nameBrand } = req.body
  Brand.findOne({ nameBrand })
    .then((brand) => {
      if (brand) return Promise.reject({ status: 404, message: "Brand exists" })
      let newBrand = new Brand({ nameBrand })
      return newBrand.save()
    })
    .then((brand) => res.status(201).json(brand))
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
const getBrands = (req, res, next) => {
  Brand.find()
    .then((brands) => res.status(200).json(brands))
    .catch((err) => res.status(500).json(err))
}
const updateBrandById = (req, res, next) => {
  const { nameBrand } = req.body
  let brandId = req.params
  Brand.findById(brandId)
    .then((brand) => {
      if (!brand)
        return Promise.reject({ status: 404, message: "Brand not found" })
      brand.nameBrand = nameBrand
      return brand.save().then((brand) => res.status(200).json(brand))
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
const deleteBrandById = (req, res, next) => {
  let brandId = req.params
  Brand.deleteOne({ _id: brandId })
    .then((result) => {
      if (result.n === 0)
        return Promise.reject({ status: 404, message: " Brand Not found" })
      return res.status(200).json({ message: "Deleted Successfully" })
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
module.exports = {
  createBrand,
  getBrands,
  updateBrandById,
  deleteBrandById,
}
