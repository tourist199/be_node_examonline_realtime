var Question = require('../models/question')
var Test = require('../models/test')

module.exports.getAllTest = (req, res) => {
    var result = [];
    Test.find()
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

module.exports.getTestByID = (req,res,next) =>{
    const id = req.params.id;

    Test.findOne({_id : id})
            .exec()
            .then(docs => {                
                res.status(200).json({
                    _id: docs._id,
                    title: docs.title,
                    description: docs.description,
                    createAt: docs.createAt,
                    status: docs.status
                });
            })
            .catch(err => {
                res.status(500).json({
                    error : err
                });
            });
}

module.exports.insertTest = (req,res) => {
    var data = req.body;
    var test = new Test(data);
    
    test
        .save()
        .then(docs=>{
            if(docs){
                res.status(201).json({
                    data : docs,
                    message : "success",
                    success: true
                })
            }
        })
        .catch(err=>{
            res.status(500).json({
                error : err,
                success: false
            })
        });
}