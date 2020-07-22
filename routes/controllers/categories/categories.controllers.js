const { Category } = require("../../../models/category.model")

const createCategory = (req, res, next) => {
  const { nameCategory } = req.body
  let newCategory = new Category({ nameCategory })
  return newCategory
    .save()
    .then((category) => res.status(201).json(category))
    .catch((err) => res.status(500).json(err))
}
const getCategories = (req, res, next) => {
  Category.find()
    .then((categories) => res.status(200).json(categories))
    .catch((err) => res.status(500).json(err))
}
const updateCategoryById = (req, res, next) => {
  const { nameCategory } = req.body
  let categoryId = req.params
  Category.findById(categoryId)
    .then((category) => {
      if (!category)
        return Promise.reject({ status: 404, message: "Not found" })
      category.nameCategory = nameCategory
      return category.save().then((category) => res.status(200).json(category))
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
const deleteCategoryById = (req, res, next) => {
  let categoryId = req.params
  Category.deleteOne({ _id: categoryId })
    .then((result) => {
      if (result.n === 0)
        return Promise.reject({ status: 404, message: "Category not found" })
      return res.status(200).json({ message: "Deleted successfully" })
    })
    .catch((err) => {
      if (err.status) return res.status(err.status).json(err.message)
      return res.status(500).json(err)
    })
}
module.exports = {
  createCategory,
  getCategories,
  updateCategoryById,
  deleteCategoryById,
}
