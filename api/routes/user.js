const express = require('express')
const router = express.Router()
const UserController = require('../controllers/user')
const checkAuth = require('./../middleware/check-auth')


var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.post("/login", UserController.user_login)

router.get("/get-student", UserController.get_students)

router.get("/get-users", UserController.get_user)

router.post("/register", UserController.sign_up)

router.delete("/:userId", checkAuth, UserController.delete_user)

router.post('/update-avatar/:id', upload.single('avatar'), UserController.updateAvatar);

router.post("/change-user-info", checkAuth, UserController.change_user_info)

module.exports = router