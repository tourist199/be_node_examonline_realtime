const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const checkAuth = require('./../middleware/check-auth')

router.post("/login", UserController.user_login)

router.get("/:page", UserController.get_user)

router.post("/register", UserController.sign_up)

router.delete("/:userId",checkAuth, UserController.delete_user)

router.post("/check-token",checkAuth, UserController.check_token)

router.post("/change-user-info",checkAuth, UserController.change_user_info)

module.exports = router