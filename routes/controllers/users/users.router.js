const express = require("express")
const userControllers = require("./users.controllers")

const router = express.Router()

router.post("/", userControllers.register)
router.get("/", userControllers.getUsers)
router.post("/login", userControllers.login)
router.put("/", userControllers.updateUserById)

module.exports = router
