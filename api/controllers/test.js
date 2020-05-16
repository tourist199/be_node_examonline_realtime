var Test = require('../models/test')
var Question = require('../models/question')
const mongoose = require('mongoose')
var convertToObjectId = require('mongodb').ObjectId;

module.exports.getAllTest = (req, res) => {
    let page = parseInt(req.params.page) - 1
    skipRecord = page ? 5 * page : 0

    let userData = req.userData
    var result = [];
    Test.find({ createdBy: userData.userId })
        .skip(skipRecord)
        .limit(5)
        .exec()
        .then(docs => {
            docs.forEach(ele => {
                result.push({
                    _id: ele._id,
                    title: ele.title,
                    description: ele.description,
                    createAt: ele.createAt,
                    status: ele.status
                });
            });
            res.status(200).json({
                success: true,
                result: {
                    result,
                    total: docs.length
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                result: {
                    error: err,
                    message: "fails"
                },
                success: false
            });
        });
}

module.exports.getTestByID = (req, res, next) => {
    const id = req.params.id;

    Test.findOne({ _id: id })
        .populate('questions')
        .exec()
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.insertTestAndQuestion = (req, res) => {
    var data = req.body;
    console.log(data);

    var test = new Test({
        _id: new mongoose.Types.ObjectId(),
        title: data.title,
        description: data.description,
        createAt: data.createAt,
        createdBy: convertToObjectId(data.createdBy),
        status: data.status
    });

    test
        .save()
        .then(docs => {
            if (docs) {
                console.log(docs);
                data.listQuestion.forEach(ele => {
                    if (ele._id) {
                        Question.find({ _id: ele._id })
                            .updateOne({ $set: ele })
                            .exec()
                    } else {
                        var item = new Question({ ...ele, testId: convertToObjectId(docs._id), _id: new mongoose.Types.ObjectId() });
                        item.save(function (err, success) {
                            if (err) return console.error(err);
                            console.log(success);
                        });
                    }

                });

                res.status(201).json({
                    success: true,
                    result: {
                        message: "Add new test and quesion successfully",
                        data: questions
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                success: true,
                result: {
                    message: "Add new test and quesion successfully",
                    data: questions
                }
            })
        });
}

module.exports.updateTest = (req, res, next) => {
    const id = req.params.id;
    const data = req.body;

    Test.find({ _id: id })
        .updateOne({ $set: data })
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json({
                    data: result,
                    message: "success",
                    success: true
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
}

module.exports.deleteTest = (req, res, next) => {
    var id = req.params.id;

    Test.findByIdAndRemove(id)
        .then(docs => {
            if (!docs) {
                return res.status(404).send({
                    message: "Test not found with id " + id
                });
            }
            return res.status(200).json({
                message: "Test delete success",
                success: true
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Test not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Could not delete test with id " + id
            });
        });
}