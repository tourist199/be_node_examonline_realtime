var Exam = require('../models/exam')
const mongoose = require('mongoose')

module.exports.getAllExam = (req, res) => {
    var result = [];
    Exam.find()
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
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                message: "fails",
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

module.exports.insertTest = (req, res) => {
    var data = req.body;
    var test = new Test({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    test
        .save()
        .then(docs => {
            if (docs) {
                res.status(201).json({
                    data: docs,
                    message: "success",
                    success: true
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err,
                success: false
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