const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const checkAuth = require('./../middleware/check-auth')

router.post("/login", UserController.user_login)

router.get("/get-student", UserController.get_students)

router.get("/get-users", UserController.get_user)

router.post("/register", UserController.sign_up)

router.delete("/:userId",checkAuth, UserController.delete_user)

router.post("/change-user-info",checkAuth, UserController.change_user_info)

module.exports = router