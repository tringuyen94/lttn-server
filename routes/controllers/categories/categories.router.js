const express = require("express")
const categoriesControllers = require("../categories/categories.controllers")

const router = express.Router()

router.get("/", categoriesControllers.getCategories)
router.post("/create-category", categoriesControllers.createCategory)
router.put("/update-category-by-id/:_id", categoriesControllers.updateCategoryById)

module.exports = router
