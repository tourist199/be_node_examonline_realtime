var convertToObjectId = require('mongodb').ObjectId;
var Question = require('./../models/question')
const mongoose = require('mongoose')



module.exports.insertManyQuestion = (req, res, next) => {
    var { questions, testId } = req.body;
    questions.forEach(ele => {
        if (ele._id) {
            Question.find({ _id: ele._id })
            .updateOne({ $set: ele })
            .exec()
        } else {
            var item = new Question({ ...ele, testId: convertToObjectId(testId), _id: new mongoose.Types.ObjectId() });
            item.save(function (err, success) {
                if (err) return console.error(err);
                console.log(success);

            });
        }

    });
    return res.status(201).json({
        message: "Add new quesion successfully",
        data: questions
    })
}

module.exports.getQuestionsByTestId = (req, res, next) => {
    var testId = req.params.testId;
    Question.find({ testId: testId })
        // .populate('testId')
        .exec()
        .then(docs => {
            if (docs) {
                res.status(200).json({
                    data: docs,
                    count: docs.length,
                    message: "success",
                    success: true
                });
            }
            else {
                res.status(401).json({
                    message: "Not found"
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}