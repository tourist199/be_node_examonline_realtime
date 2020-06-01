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



exports.updateImageQuestion = async (req, res) => {
    // var quesId = req.params.id;
    // console.log(quesId, quesId);
    
    let path2 = "uploads/imageQuestion/" + req.file.filename;
    console.log('upload img :' + path2);

    // if (quesId && quesId != undefined) {
    //     const quesItem = await Question.findOne({ _id: quesId }).exec();
    //     if (path2 != quesItem.image) {
    //         fs.unlink(quesItem.image, () => { })
    //         console.log(quesItem.image);
    //     }

    //     const result = await Question.findOne({ _id: quesId })
    //         .updateOne({ image: path2 })
    //         .catch(err => {
    //             res.status(500).json({
    //                 success: false,
    //                 result: {
    //                     err,
    //                     message: 'Upload image failed'
    //                 }
    //             })
    //         });
    // }

    res.status(200).json({
        success: true,
        result: {
            pathCurrent: path2
        }
    });

}