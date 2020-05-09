const mongoose = require('mongoose')

const testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required : true},
    description : {type: String, required: true},
    createAt: {type: Date, default: Date.now},
    status : {type: String, required: true}
})

module.exports = mongoose.model('Test', testSchema)