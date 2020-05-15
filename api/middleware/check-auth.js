const jwt = require('jsonwebtoken')
const User = require('../models/user')

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        User.findOne({ token : token })
            .exec()
            .then(user => {
                // console.log(user,token);
                if (!user) {
                    return res.status(403).json({
                        tokensai: 'no accept',
                        success: false
                    })
                }
                const decoded = jwt.verify(token, process.env.JWT_KEY);
                req.userData = decoded;
                // console.log(decoded);
                
                
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
