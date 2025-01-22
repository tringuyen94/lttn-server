const Factory = require('../factory');
const Brand = require('../models/brand.model');

const createBrand = new Factory(Brand).create;
const getBrands = new Factory(Brand).getAll;
const deleteBrand = new Factory(Brand).delete;

module.exports = {
  createBrand,
  getBrands,
  deleteBrand,
};
