const express = require("express")
const brandControllers = require("./brands.controllers")
const router = express.Router()

router.get("/get-brands", brandControllers.getBrands)
router.post("/create-brand", brandControllers.createBrand)
router.put("/update-brand-by-id/:_id", brandControllers.updateBrandById)

module.exports = router
