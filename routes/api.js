const express = require("express")
const categoriesRouter = require("./controllers/categories/categories.router")
const productsRouter = require("./controllers/products/products.router")
const userRouter = require("./controllers/users/users.router")
const brandRouter = require("./controllers/brands/brands.router")
const projectRouter = require('./controllers/projects/projects.router')

const router = express.Router()

router.use("/categories", categoriesRouter)
router.use("/products", productsRouter)
router.use("/users", userRouter)
router.use("/brands", brandRouter)
router.use('/projects',projectRouter)


module.exports = router
