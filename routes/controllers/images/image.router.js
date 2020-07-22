const express = require("express")
const uploadImage = require("../../../middlewares/uploadimage.middleware")
const imageControlllers = require("./image.controllers")

const router = express.Router()
router.post("/uploads", uploadImage("products"), imageControlllers.uploadImage)
router.get("/", imageControlllers.getImages)
router.get("/:_id", imageControlllers.getImageById)

module.exports = router
