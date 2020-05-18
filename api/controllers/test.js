var Test = require('../models/test')
var Question = require('../models/question')
const mongoose = require('mongoose')
var convertToObjectId = require('mongodb').ObjectId;

module.exports.getAllTestPagination = (req, res) => {
    let page = parseInt(req.query.page) - 1
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

module.exports.getAllTest = (req, res) => {
    let page = parseInt(req.query.page) - 1
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

module.exports.getTestsWaitting = (req, res) => {
    let page = parseInt(req.query.page) - 1
    skipRecord = page ? 5 * page : 0
    var result = [];
    Test.find({ status: 'WAITTING' })
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
        .exec()
        .then(doc => {
            Question.find({ testId: id })
                .exec()
                .then(docs => {
                    res.status(200).json({
                        success: true,
                        result: { test: doc, listQuestion: docs }
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

module.exports.insertTestAndQuestion = (req, res) => {
    var data = req.body;
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
                if (data.listQuestion) {
                    Question.bulkWrite(
                        data.listQuestion.map((item) => {
                            if (!item._id)
                                return {
                                    insertOne: {
                                        document: {
                                            _id: new mongoose.Types.ObjectId(),
                                            title: item.title,
                                            description: item.description,
                                            answers: item.answers,
                                            result: item.result,
                                            testId: docs._id
                                        }
                                    }
                                }
                            else
                                return {
                                    updateOne: {
                                        filter: { _id: item._id },
                                        update: {
                                            ...item
                                        },
                                        upsert: true
                                    }
                                }
                        })
                    ).then(rs => {
                        res.status(201).json({
                            success: true,
                            result: {
                                message: "Add new test and quesion successfully",
                                data: rs
                            }
                        })
                    })
                }
            }
        })
        .catch(note => {
            res.status(500).json({
                success: false,
                result: {
                    message: "Add failed",
                    note
                }
            })
        });
}

module.exports.updateTest = (req, res, next) => {
    const {id} = req.params;
    const data = req.body;
    Test.find({ _id: id })
        .updateOne({ $set: data })
        .exec()
        .then(result => {
            if (data.listQuestion) {
                Question.bulkWrite(
                    data.listQuestion.map((item) => {
                        if (!item._id)
                            return {
                                insertOne: {
                                    document: {
                                        _id: new mongoose.Types.ObjectId(),
                                        title: item.title,
                                        description: item.description,
                                        answers: item.answers,
                                        result: item.result,
                                        testId: id
                                    }
                                }
                            }
                        else
                            return {
                                updateOne: {
                                    filter: { _id: item._id },
                                    update: {
                                        ...item
                                    }
                                    // ,upsert: true
                                }
                            }
                    }),
                    
                ).then(rs => {
                    res.status(201).json({
                        success: true,
                        result: {
                            message: "Update test and quesion successfully",
                            data: rs
                        }
                    })
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    err,
                    message: "Update failed"
                }
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
            Question.deleteMany({ testId: id })
                .then(doc => {
                    return res.status(200).json({
                        success: true,
                        result: {
                            message: "Test delete success",
                            doc
                        }
                    });
                })
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