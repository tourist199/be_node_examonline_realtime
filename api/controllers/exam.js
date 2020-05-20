var Exam = require('../models/exam')
var ExamStudent = require('../models/exam_student')
const mongoose = require('mongoose')

module.exports.getExamsByTeacher = async (req, res) => {
    let userData = req.userData
    let page = parseInt(req.query.page) - 1
    skipRecord = page ? 5 * page : 0
    var result = [];
    let num = await Exam.find({ createdBy: userData.userId }).count()
    Exam.find({ createdBy: userData.userId })
        .populate('testId')
        .skip(skipRecord)
        .limit(5)
        .exec()
        .then(docs => {
            docs.forEach(ele => {
                result.push(ele);
            });
            res.status(200).json({
                success: true,
                result: {
                    listExam: result,
                    total: num
                },
                
            });
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    error: err,
                    message: "fails",
                }
            });
        });
}

module.exports.getExamsStudent = async (req, res) => {
    let userData = req.userData

    ExamStudent
        .find({studentId: userData.userId})
        .populate('examId')
        .exec()
        .then( docs => {
            let listExam = docs.map(item => item.examId)
            res.json(listExam)
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    error: err,
                    message: "fails",
                }
            });
        });

}

module.exports.getExamById = (req, res) => {

    Exam.findOne({ _id: req.params.id })
        .populate('testId', 'title')
        .then(docs => {
            ExamStudent.find({ examId: req.params.id })
            .populate('studentId', 'name email')
                .exec()
                .then(rs => {
                    res.status(200).json({
                        success: true,
                        result: {
                            exam: docs, 
                            listStudent: rs
                        }
                    });
                })

        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    error: err,
                    message: "fails",
                }
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
        title: data.title,
        description: data.description,
        testId: data.testId,
        timeStart: data.timeStart,
        timeEnd: data.timeEnd,
        createdBy: data.createdBy
    });
    console.log(data.listStudent);

    exam
        .save()
        .then(async docs => {
            if (docs) {
                let idExam = docs._id
                let docsDeleteExam = await ExamStudent
                    .deleteMany({ examId: idExam })

                let docsInsertExam = await ExamStudent
                    .insertMany(
                        data.listStudent.map(item => {
                            return {
                                _id: new mongoose.Types.ObjectId(),
                                examId: idExam,
                                studentId: item
                            }
                        })
                    )

                res.status(201).json({
                    success: true,
                    result: {
                        data: docs,
                        message: "success",
                        docsDeleteExam,
                        docsInsertExam
                    }
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