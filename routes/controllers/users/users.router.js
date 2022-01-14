const express = require("express")
const userControllers = require("./users.controllers")

const router = express.Router()

router.post("/register", userControllers.register)
router.get("/", userControllers.getUsers)
router.post("/login", userControllers.login)
router.put("/update-by-id/:id", userControllers.updateUserById)

module.exports = router
