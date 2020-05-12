const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required : true},
    name : {type: String, required: true},
    password: {type:String , required : true},
    token : {type: String},
    cardId : {type: String},
    gender: {type: String},
    birthday: {type: Date, require: true},
    address: {type: String},
    phoneNumber: {type: String},
    type: {type: String, required: true, default: 'STUDENT'},
    createAt: {type: Date, default: Date.now}
})

module.exports = mongoose.model('User', userSchema)