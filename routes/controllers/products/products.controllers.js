const Product = require("../../../models/product.model")
const { default: slugify } = require("slugify")
const cloudinary = require('cloudinary')


const createProduct = async (req, res, next) => {
  let imageLinks = []
  try {
    for (let image of req.body.productImages) {
      // const result = await cloudinary.v2.uploader.upload(image, { folder: "lttn-electric/products" })
      const result = await cloudinary.v2.uploader.upload(image,{folder:'lttn-electric/products'})
      console.log(result)
      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url
      })
    }
    req.body.productImages = imageLinks

  } catch (err) {
    return res.status(500).json({ err, message: "Đã xảy ra lỗi" })
  }
  const slug = slugify(req.body.name, { lower: true })
  let product = await Product.findOne({ name: req.body.name })
  if (product) return res.status(500).json({ message: "Tên sản phẩm đã tồn tại" })
  let newProd = await Product.create({ ...req.body, slug })
  return res.status(201).json({ newProd, message: `Thêm ${req.body.name} thành công` })
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
    .then(products => res.status(200).json(products))
    .catch(err => res.status(500).json(err))
}

const updateProductById = async (req, res) => {
  // Remove undefined key-value on req.body
  Object.keys(req.body).forEach(key => req.body[key] === 'undefined' && delete req.body[key])
  let product = await Product.findById(req.params._id)
  // ConstantSourceNod

  try {
    if (req.body.productImages !== 'undefined') {
      for (let image of product.productImages) {
        await cloudinary.v2.uploader.destroy(image.public_id)
      }
      let imageLinks = []
      for (let image of req.body.productImages) {
        const result = await cloudinary.v2.uploader.upload(image, { folder: "lttn-electric/products" })
        imageLinks.push({
          public_id: result.public_id,
          url: result.secure_url
        })
      }
      req.body.productImages = imageLinks
    }
  } catch (err) {
    return res.status(500).json({ err, message: "Đã xảy ra lỗi" })
  }
  Product.findByIdAndUpdate(req.params._id, req.body, { new: true, runValidators: true }, function (err, result) {
    if (err) return res.status(500).json({ err, message: "Cập nhật thất bại" })
    return res.status(200).json({ updated: result, message: "Cập nhật thành công" })
  })
}


const deleteProductById = async (req, res) => {
  //Find Product
  let product = await Product.findById(req.params._id)
  // If not found product
  if (!product) return res.status(404).json({ message: "Xoá thất bại" })
  //Delete Images On Cloudinarys
  for (let image of product.productImages) {
    await cloudinary.v2.uploader.destroy(image.public_id)
  }
  //Remove Product from data
  await Product.deleteOne({_id:product._id})

  return res.status(200).json({ message: ` Xoá ${product.name} thành công` })

}


module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProductById,
  deleteProductById,
  getProductsByCategory,
}
