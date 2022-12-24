const express = require("express")
const productControllers = require("./products.controllers")
const router = express.Router()


router.post('/create-product', productControllers.createProduct)
router.get('/get-products', productControllers.getProducts)
router.get('/get-product-by-id/:_id', productControllers.getProductById)
router.get('/get-products-by-category/:categoryId', productControllers.getProductsByCategory)


router.delete('/delete-product/:_id', productControllers.deleteProductById)
router.put('/update-product/:_id', productControllers.updateProductById)



module.exports = router