const express = require("express")
const productControllers = require("./products.controllers")
const router = express.Router()

router.post("/", productControllers.createProduct)
router.get("/", productControllers.getProducts)
router.get("/:_id", productControllers.getProductById)
router.put("/:_id", productControllers.updateProductById)
router.get("/byPagination/:page", productControllers.getProductsByPagination)
router.get(
  "/byCategory/:categoryId/:page",
  productControllers.getProductsByCategory
)
router.post("/byHMIs/:page", productControllers.getHmisByFilter)
router.post("/byPLcs/:page", productControllers.getPlcsByFilter)
router.post("/byConverters/:page", productControllers.getConvertersByFilter)
router.post("/byName/:page", productControllers.getProductsByName)
router.delete("/:_id", productControllers.deleteProductById)

module.exports = router
