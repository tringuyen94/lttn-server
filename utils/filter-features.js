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
      this.queryString.sortByCapacity &&
      this.queryString.category === '5e67d1d3616a8d11cc4eacab'
    ) {
      switch (this.queryString.sortByCapacity) {
        case 'asc':
          this.query.sort({ product_capacity: 1 });
          break;
        case 'desc':
          this.query.sort({ product_capacity: -1 });
          break;
        default:
          break;
      }
    } else {
      this.query.sort('--createdAt');
    }
    return this;
  }
}

module.exports = FilterFeature;
