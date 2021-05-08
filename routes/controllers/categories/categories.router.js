const express = require("express")
const categoriesControllers = require("../categories/categories.controllers")

const router = express.Router()

router.get("/", categoriesControllers.getCategories)
router.post("/", categoriesControllers.createCategory)
router.put("/:_id", categoriesControllers.updateCategoryById)
router.delete("/:_id", categoriesControllers.deleteCategoryById)

module.exports = router
