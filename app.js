const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const userRouters = require('./api/routes/user')
const testRouters = require('./api/routes/test')
const questionRouters = require('./api/routes/question')
const examRouters = require('./api/routes/exam')
const examStudentRouters = require('./api/routes/exam-student')

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
const URL = "mongodb+srv://khanh:khanhadmin@cluster0-xpqhc.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(URL)
mongoose.Promise = global.Promise


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const checkAuth = require('./api/middleware/check-auth')


app.use(cors())


app.use('/users', userRouters)
app.use('/tests', checkAuth, testRouters)
app.use('/questions', checkAuth, questionRouters)
app.use('/exams', checkAuth, examRouters)
app.use('/exam-student', checkAuth, examStudentRouters)

app.use((req, res, next) => {
    const err = new Error('Not found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.json({
        success: false,
        result: {
            message: 'APP - FAILED - SAI DUONG DAN',
            err: err
        }
    })
})

module.exports = app;