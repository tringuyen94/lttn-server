const { Product } = require("../../../models/product.model")
const Pagination = require("../../../middlewares/pagination.middleware")

const createProduct = (req, res, next) => {
  const { name, image, brand, detail, capacity, category, isNewOne } = req.body
  const newProduct = new Product({ name, image, brand, detail, capacity, isNewOne, category })
  return newProduct
    .save()
    .then((product) => {
      product.populate("image")
      return res.status(201).json(product)
    })
    .catch((err) => res.status(500).json(err))
}
const getProducts = (req, res, next) => {
  Product.find()
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((products) => res.status(200).json(products))
    .catch((err) => res.status(500).json(err))
}
const getProductById = (req, res, next) => {
  const productId = req.params
  Product.findById(productId)
    .populate("category")
    .populate("image")
    .populate("brand")
    .then((product) => {
      if (!product)
        return Promise.reject({ status: 404, message: "Product not found" })
      return res.status(200).json(product)
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      res.status(500).json(err)
    })
}
const getProductsByCategory = (req, res, next) => {
  const { categoryId, page } = req.params
  Product.find({ category: categoryId })
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((products) => {
      return Pagination(page, products)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
const getProductsByPagination = (req, res, next) => {
  const { page } = req.params
  Product.find()
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((products) => {
      Pagination(page, products)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
}
const updateProductById = (req, res, next) => {
  const productId = req.params
  const { name, image, capacity, brand, detail, category, isNewOne } = req.body
  Product.findById(productId)
    .then((product) => {
      if (!product)
        return Promise.reject({ status: 404, message: "Product not found" })
      product.name = name
      product.image = image
      product.category = category
      product.brand = brand
      product.detail = detail
      product.capacity = capacity
      product.isNewOne = isNewOne
      return product.save()
        .then((product) => res.status(200).json(product))
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
const deleteProductById = (req, res) => {
  const productId = req.params
  Product.deleteOne({ _id: productId })
    .then((result) => {
      if (result.n === 0)
        return Promise.reject({ status: 404, message: "Not found" })
      return res.status(200).json({ message: "Delete successfully" })
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
const getConvertersByFilter = (req, res, next) => {
  const { brandId, isNewOne } = req.body
  const { page } = req.params
  if (!brandId) return Product.find({ category: "5e67d1d3616a8d11cc4eacab", isNewOne })
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((converters) => {
      return Pagination(page, converters)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
  if (!isNewOne) return Product.find({ category: "5e67d1d3616a8d11cc4eacab", brand: brandId })
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((converters) => {
      return Pagination(page, converters)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
  Product.find({ category: "5e67d1d3616a8d11cc4eacab", brand: brandId, isNewOne })
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((converters) => {
      return Pagination(page, converters)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
}
const getPlcsByFilter = (req, res, next) => {
  const { brandId } = req.body
  const { page } = req.params
  Product.find({ category: "5e67d1dc616a8d11cc4eacac", brand: brandId })
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((plcs) => {
      return Pagination(page, resultArr)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
}
const getHmisByFilter = (req, res, next) => {
  const { brandId } = req.body
  const { page } = req.params
  Product.find({ category: "5e67d1e4616a8d11cc4eacad", brand: brandId })
    .populate("image")
    .populate("category")
    .populate("brand")
    .then((hmis) => {
      return Pagination(page, hmis)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => res.status(500).json(err))
}
const getProductsByName = (req, res, next) => {
  let resultArr = []
  const { name } = req.body
  const { page } = req.params
  Product.find()
    .populate("image")
    .populate("brand")
    .populate("category")
    .then((products) => {
      let tempName = name.toUpperCase()
      products.map((product) => {
        if (product.name.indexOf(tempName) !== -1) {
          resultArr.push(product)
        }
        return resultArr
      })
      if (resultArr.length === 0)
        return Promise.reject({ status: 404, message: "Not found" })
      return Pagination(page, resultArr)
    })
    .then((result) => res.status(200).json(result))
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  getConvertersByFilter,
  getPlcsByFilter,
  getHmisByFilter,
  deleteProductById,
  getProductsByPagination,
  getProductsByCategory,
  getProductsByName,
}
