const express = require('express')
const router = express.Router()
const TestController = require('../controllers/test')

router.post("/insert", TestController.insertTestAndQuestion)

router.get("/getTestsByTeacher", TestController.getAllTest)

router.get("/getTestsWatting", TestController.getTestsWaittingAdmin)

router.put("/change-status-test-draft/:id", TestController.changeStatusTestDraft)

router.put("/change-status-test-done/:id", TestController.changeStatusTestDone)

router.get("/:id", TestController.getTestByID)

router.put("/:id", TestController.updateTest)

router.delete("/:id", TestController.deleteTest)

module.exports = router