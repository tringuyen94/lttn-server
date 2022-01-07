const Category = require("../../../models/category.model")

const createCategory = (req, res, next) => {
  const { nameCategory } = req.body
  Category.findOne({ nameCategory })
    .then(category => {
      if (category) return Promise.reject({ status: 409, message: "Tên loại sản phẩm đã tồn tại" })
      let newCategory = new Category({ nameCategory })
      return newCategory.save()
    })
    .then((newCategory) => res.status(201).json({ category: newCategory, message: `Đã thêm "${newCategory.nameCategory}" thành công` }))
    .catch((err) => {
      if (err.status) return res.status(err.status).json({ message: err.message })
      return res.status(500).json({ err, message: "Thêm thất bại" })
    })
}
const getCategories = (req, res, next) => {
  Category.find()
    .then((categories) => res.status(200).json(categories))
    .catch((err) => res.status(500).json(err))
}
const updateCategoryById = (req, res, next) => {
  Category.findByIdAndUpdate(req.params, { $set: req.body }, { new: true }, function (err, result) {
    if (err) return res.status(500).json({ message: "Cập nhật thất bại" })
    return res.status(200).json({ updated: result, message: "Cập nhật thành công" })
  })
}

module.exports = {
  createCategory,
  getCategories,
  updateCategoryById,
}
