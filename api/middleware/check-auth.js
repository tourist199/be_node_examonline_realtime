const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        User.findOne({ token : token })
            .exec()
            .then(user => {
                if (!user) {
                    return res.status(403).json({
                        result: {
                            message: 'TOKEN_EXPIRED'
                        },
                        success: false
                    })
                }
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                req.userData = decoded;
                next()
            })
            .catch(err=>{
                res.json({
                    tokensai: 'not found',
                    success: false
                })
            })

    } catch (err) {
        return res.status(401).json({
            ms: 'auth failed',
            success: false
        })
    }
}
