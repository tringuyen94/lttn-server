const Pagination = (page, productArr) => {
  let pageIndex = []
  let pageCount = Math.ceil(productArr.length / 9)
  for (let i = 1; i <= pageCount; i++) {
    pageIndex.push(i)
  }
  if (!page)
    return Promise.resolve({
      page: 1,
      pageCount,
      pageIndex,
      productsCount: productArr.length,
      productByPagination: productArr.slice(1 * 9 - 9, 1 * 9),
    })
  else if (page > pageCount)
    return Promise.resolve({
      page: pageCount,
      pageCount,
      pageIndex,
      productsCount: productArr.length,
      productByPagination: productArr.slice(9 * 9 - 9, 9 * 9),
    })
  else
    return Promise.resolve({
      page,
      pageCount,
      pageIndex,
      productsCount: productArr.length,
      productsByPagination: productArr.slice(page * 9 - 9, page * 9),
    })
}
module.exports = Pagination
