const express = require("express")
const categoriesRouter = require("./controllers/categories/categories.router")
const productsRouter = require("./controllers/products/products.router")
const userRouter = require("./controllers/users/users.router")
const imageRouter = require("./controllers/images/image.router")
const brandRouter = require("./controllers/brands/brands.router")
const router = express.Router()

router.use("/categories", categoriesRouter)
router.use("/products", productsRouter)
router.use("/users", userRouter)
router.use("/images", imageRouter)
router.use("/brands", brandRouter)

module.exports = router
