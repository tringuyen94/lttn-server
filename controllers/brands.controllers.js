const Factory = require('../factory');
const Brand = require('../models/brand.model');

const createBrand = new Factory(Brand).create;
const getBrands = new Factory(Brand).getAll;
const updateBrand = new Factory(Brand).update;
const deleteBrand = new Factory(Brand).delete;

module.exports = {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand,
};
