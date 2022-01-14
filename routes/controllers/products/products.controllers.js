const Product = require("../../../models/product.model")
const { default: slugify } = require("slugify")



const createProduct = (req, res, next) => {
  const { name, brand, detail, capacity, category, isNewProduct } = req.body
  const productImages = req.files.map(file => file.path)
  const slug = slugify(name, { lower: true })
  Product.findOne({ name })
    .then(product => {
      if (product) return Promise.reject({ status: 403, message: "Tên sản phẩm đã tồn tại" })
      let newProd = new Product({ name, slug, brand, detail, capacity, category, isNewProduct, productImages })
      newProd.save()
    })
    .then(_product => res.status(201).json({ message: "Thêm sản phẩm thành công", product: _product }))
    .catch(err => {
      if (err.status) return res.status(err.status).json({ message: err.message })
      return res.status(500).json({ message: "Thêm sản phẩm thất bại", err })
    })
}
const getProducts = (req, res, next) => {
  Product.find()
    .populate("category")
    .populate("brand")
    .then((products) => res.status(200).json(products))
    .catch((err) => res.status(500).json(err))
}
const getProductById = (req, res, next) => {
  Product.findById(req.params)
    .populate("category")
    .populate("brand")
    .then((product) => {
      if (!product)
        return Promise.reject({ status: 404, message: "Không tìm thấy sản phẩm" })
      return res.status(200).json(product)
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      res.status(500).json({ message: "Lỗi" })
    })
}


const getProductsByCategory = (req, res, next) => {
  const { categoryId } = req.params
  Product.find({ category: categoryId })
    .populate("image")
    .populate("category")
    .populate("brand")
    .then(products => res.status(200).json(products))
    .catch(err => res.status(500).json(err))
}

const updateProductById = (req, res) => {
  Product.findByIdAndUpdate(req.params, { $set: req.body }, { new: true }, function (err, result) {
    if (err) return res.status(500).json({ message: "Cập nhật thất bại" })
    return res.status(200).json({ updated: result, message: "Cập nhật thành công" })
  })
}
const updateImageProduct = (req, res) => {
  const productImages = req.files.map(file => file.path)
  Product.findByIdAndUpdate(req.params, { $set: { productImages } }, function (err, result) {
    if (err) return res.status(500).json({ message: "Cập nhật ảnh thất bại" })
    return res.status(200).json({ updated: result, message: "Cập nhật ảnh thành công" })
  })
}
const deleteProductById = (req, res) => {
  Product.deleteOne({ _id: req.params })
    .then((result) => {
      if (result.n === 0) return Promise.reject({ status: 404, message: "Không tìm thấy sản phẩm" })
      return res.status(202).json({ message: "Xoá thành công" })
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json({ message: "Xoá thất bại" })
    })
}


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  updateImageProduct,
  deleteProductById,
  getProductsByCategory,
}
