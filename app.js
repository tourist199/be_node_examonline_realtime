const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const userRouters = require('./api/routes/user')
const testRouters = require('./api/routes/test')
const questionRouters = require('./api/routes/question')

mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology',true );
const URL = "mongodb+srv://khanh:khanhadmin@cluster0-xpqhc.gcp.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(URL)
mongoose.Promise = global.Promise


app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())


app.use(cors())


app.use('/users', userRouters)
app.use('/tests', testRouters)
app.use('/questions', questionRouters)

app.use((req, res, next)=>{
    const err = new Error('Not found')
    err.status = 404
    next(err)
})

app.use((err, req, res, next)=>{
    res.status( err.status || 500)
    res.json ({
        err: {
            ms : err.message
        }
    })
})

module.exports = app;