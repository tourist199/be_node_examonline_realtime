var Exam = require('../models/exam')
var ExamStudent = require('../models/exam_student')
const mongoose = require('mongoose')
var convertToObjectId = require('mongodb').ObjectId;

module.exports.getExamsTeacherPage = async (req, res) => {
    let userData = req.userData
    // let page = parseInt(req.query.page) - 1
    // skipRecord = page ? 5 * page : 0
    let num = await Exam.find({ createdBy: userData.userId }).countDocuments()
    Exam.find({ createdBy: userData.userId })
        .populate('testId')
        // .skip(skipRecord)
        // .limit(5)
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                result: {
                    listExam: docs,
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
        .find({ studentId: userData.userId })
        .populate('examId')
        .exec()
        .then(docs => {
            let listExam = docs.map(item => ({ ...item.examId._doc, submit: item.submit }))
            console.log(docs);
            res.status(200).json({
                success: true,
                result: {
                    listExam
                }
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

/**
 * No pagination
 */

module.exports.getExamsTeacher = (req, res) => {
    let userData = req.userData

    Exam.find({ createdBy: userData.userId })
        .populate('testId')
        .exec()
        .then(docs => {
            res.status(200).json({
                success: true,
                result: {
                    listExam: docs
                }
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

module.exports.getExamById = (req, res) => {
    Exam.findOne({ _id: req.params.id })
        .populate('testId')
        .then(docs => {
            ExamStudent.find({ examId: req.params.id })
                .select('_id examId studentId')
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
                // let docsDeleteExam = await ExamStudent
                //     .deleteMany({ examId: idExam })

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
                        // docsDeleteExam,
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
    const { _id, title, description, timeStart, timeEnd, listStudent } = req.body;
    Exam.findOneAndUpdate(
        { _id: _id },
        {
            title, description, timeStart, timeEnd
        },
        { new: true }
    )
        .then(async docs => {
            if (docs) {
                let docsDeleteExam = await ExamStudent
                    .deleteMany({ examId: _id })

                let docsInsertExam = await ExamStudent
                    .insertMany(
                        listStudent.map(item => {
                            return {
                                _id: new mongoose.Types.ObjectId(),
                                examId: convertToObjectId(_id),
                                studentId: convertToObjectId(item)
                            }
                        })
                    )

                res.status(201).json({
                    success: true,
                    result: {
                        data: docs,
                        message: "update exam success",
                        docsDeleteExam,
                        docsInsertExam
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                success: false,
                result: {
                    err,
                    message: 'Update Exam Failed'
                }
            })
        })
}

module.exports.deleteExam = (req, res, next) => {
    var id = req.params.idExam;
    console.log('delete exam :' +id);
    
    Exam.findByIdAndRemove(id)
        .then(docs => {
            ExamStudent.deleteMany({ examId: id })
                .then(ss => {
                    return res.status(200).json({
                        result: { message: "Exam delete success", idExamDeleted: id },
                        success: true
                    });
                })
                .catch(err => {
                    return res.status(500).json({
                        result: { message: "Delete exam success, but delete question failed" },
                        success: false
                    });
                })

        }).catch(err => {
            return res.status(500).json({
                result: {
                    message: "Delete exam failed 1"
                }
            });

        });
}