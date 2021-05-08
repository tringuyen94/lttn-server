const express = require("express")
const brandControllers = require("./brands.controllers")
const router = express.Router()

router.get("/", brandControllers.getBrands)
router.post("/", brandControllers.createBrand)
router.put("/:_id", brandControllers.updateBrandById)
router.delete("/:_id", brandControllers.deleteBrandById)

module.exports = router
