const Category = require('../models/category.model');
const Factory = require('../factory');

const createCategory = new Factory(Category).create;
const getCategories = new Factory(Category).getAll;
const updateCategory = new Factory(Category).update;
const deleteCategory = new Factory(Category).delete;

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
