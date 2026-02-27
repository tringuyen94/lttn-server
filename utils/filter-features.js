class FilterFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filterByName() {
    if (this.queryString.product_name) {
      this.query.find({
        product_name: new RegExp(this.queryString.product_name, 'i'),
      });
    }
    return this;
  }
  filterIsNew() {
    if (this.queryString.isNew) {
      this.query.find({ product_isnew: this.queryString.isNew });
    }
    return this;
  }
  filterByBrand() {
    if (this.queryString.brand) {
      this.query.find({ brand: this.queryString.brand });
    }
    return this;
  }
  filterByCategory() {
    if (this.queryString.category) {
      this.query.find({ category: this.queryString.category });
    }
    return this;
  }
  sortByCapacity() {
    if (this.queryString.capacity) {
      const product_capacity = {};
      product_capacity.$gte = parseFloat(this.queryString.capacity.gte) || 0;
      product_capacity.$lte = parseFloat(this.queryString.capacity.lte) || 100;
      this.query.find({ product_capacity });
    } else {
      this.query.sort('-createdAt');
    }
    return this;
  }
  paginate(defaultLimit = 20) {
    const page = Math.max(parseInt(this.queryString.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(this.queryString.limit) || defaultLimit, 1), 100);
    const skip = (page - 1) * limit;
    this.page = page;
    this.limit = limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = FilterFeature;
