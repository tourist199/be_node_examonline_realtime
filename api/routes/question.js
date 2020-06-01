const express = require('express')
const router = express.Router()
const QuestionController = require('../controllers/question')

var multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/imageQuestion/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
var upload = multer({ storage: storage });


router.post("/insertManyQuestion", QuestionController.insertManyQuestion)

router.get("/:testId", QuestionController.getQuestionsByTestId)

router.post("/update/:id", upload.single('image'), QuestionController.updateImageQuestion)

module.exports = router