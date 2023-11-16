const express = require("express")
const counterController = require("./counter.controller")
const router = express.Router()


router.put('/update-counter', counterController.updateCounter)




module.exports = router