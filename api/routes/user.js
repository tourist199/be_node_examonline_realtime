const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')

router.post("/login", UserController.user_login)

router.get("/:page", UserController.get_user)

router.post("/register", UserController.sign_up)

router.delete("/:userId", UserController.delete_user)

router.post("/check-token", UserController.check_token)


module.exports = router