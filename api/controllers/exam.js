var Exam = require('../models/exam')
const mongoose = require('mongoose')

module.exports.getAllExam = (req, res) => {
    var result = [];
    Exam.find()
        .exec()
        .then(docs => {
            docs.forEach(ele => {
                result.push(ele);
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

module.exports.getExamByID = (req, res, next) => {
    const id = req.params.id;
    Exam.findOne({ _id: id })
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

module.exports.insertExam = (req, res) => {
    var data = req.body;
    var exam = new Exam({
        _id: new mongoose.Types.ObjectId(),
        ...data
    });

    exam
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

module.exports.updateExam = (req, res, next) => {
    const id = req.params.id;
    const data = req.body;

    Exam.find({ _id: id })
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

module.exports.deleteExam = (req, res, next) => {
    var id = req.params.id;

    Exam.findByIdAndRemove(id)
        .then(docs => {
            if (!docs) {
                return res.status(404).send({
                    message: "Exam not found with id " + id
                });
            }
            return res.status(200).json({
                message: "Exam delete success",
                success: true
            });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Exam not found with id " + id
                });
            }
            return res.status(500).send({
                message: "Could not delete Exam with id " + id
            });
        });
}