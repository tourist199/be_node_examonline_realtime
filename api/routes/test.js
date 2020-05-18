const express = require('express')
const router = express.Router()
const TestController = require('../controllers/test')

router.post("/insert", TestController.insertTestAndQuestion)

router.get("/getTestsByTeacher", TestController.getAllTest)

router.get("/getTestsWatting", TestController.getTestsWaitting)

router.get("/:id", TestController.getTestByID)

router.put("/:id", TestController.updateTest)

router.delete("/:id", TestController.deleteTest)

module.exports = router