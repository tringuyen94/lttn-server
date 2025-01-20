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
    if (
      this.queryString.capacity &&
      this.queryString.category === '5e67d1d3616a8d11cc4eacab'
    ) {
      let product_capacity = {};
      product_capacity.$gte = parseFloat(this.queryString.capacity.gte) || 0;
      product_capacity.$lte = parseFloat(this.queryString.capacity.lte) || 100;
      this.query.find({ product_capacity });
    } else {
      this.query.sort('--createdAt');
    }
    return this;
  }
}

module.exports = FilterFeature;
