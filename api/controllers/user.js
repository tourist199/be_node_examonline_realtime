const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./../models/user')
const fs = require('fs');


exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          success: false,
          result: {
            message: 'Tài khoản hoặc mật khẩu không đúng !'
          }
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, rs) => {
        if (err) {
          return res.status(401).json({
            success: false,
            result: {
              message: 'Tài khoản hoặc mật khẩu không đúng !'
            }
          })
        }
        if (rs) {
          const { type, name, _id, avatar } = user[0]
          
          const token = jwt.sign({
            email: user[0].email,
            userId: user[0]._id,
            type: user[0].type,
            avatar: user[0].avatar
          },
            process.env.JWT_KEY,
            {
              expiresIn: "9999999d"
            },
          )

          User.find({ _id: user[0]._id })
            .updateOne({ $set: { token: token } })
            .exec()
            .then(result => {

            })
            .catch(err => {
              console.log(err, 'Lỗi cập nhật token');

            })

          return res.status(200).json({
            success: true,
            result: {
              message: 'Đăng nhập thành công',
              token,
              type,
              name,
              _id,
              avatar
            }
          })
        }
        return res.status(500).json({
          success: false,
          result: {
            message: 'Sai mật khẩu !!'
          }
        })
      })
    })
}

exports.get_user = async (req, res, next) => {
  let page = parseInt(req.query.page) - 1
  skipRecord = page ? 5 * page : 0
  let num = await User.count({})
  User.find()
    .skip(skipRecord)
    .limit(5)
    .exec()
    .then(rs => {
      res.status(200).json({
        success: true,
        result: {
          listUser: rs,
          total: num
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        err
      })
    })
}

exports.get_info = (req, res, next) => {
  let { userData } = req
  User.findOne({ _id: userData.userId })
    .then(docs => {
      res.status(200).json({
        success: true,
        result: docs
      })
    })
    .catch(err => {
      res.status(500).json({
        err
      })
    })
}

exports.get_students = (req, res, next) => {
  User.find({ type: 'STUDENT' })
    .exec()
    .then(rs => {
      res.status(200).json({
        success: true,
        result: {
          listStudent: rs
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        err
      })
    })
}

exports.sign_up = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec().then(user => {
      if (user.length > 0) {
        return res.status(409).json({
          sucess: false,
          result: {
            message: 'Email đã tồn tại'
          }
        })
      }
      else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              err
            })
          }
          else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              name: req.body.name,
              cardId: req.body.cardId,
              birthday: req.body.birthday,
              gender: req.body.gender,
              address: req.body.address,
              phoneNumber: req.body.phoneNumber,
              type: req.body.type,
              createAt: req.body.createAt

            })
            user.save()
              .then((rs) => {
                res.status(200).json({
                  success: true,
                  result: rs
                })
              })
              .catch(err => {
                res.status(500).json({
                  success: false,
                  result: err
                })
              })
          }
        })
      }
    }).catch()
}

exports.delete_user = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(rs => {
      res.status(200).json({
        success: true,
        result: {
          ...rs,
          message: 'Deleted user'
        }

      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        err
      })
    })
}

exports.check_token = (req, res, next) => {
  User.findOne({ token: req.body.token })
    .exec()
    .then(rs => {
      if (rs)
        return res.status(200).json({
          rs: true
        })
      else
        return res.status(200).json({
          rs: false,
          ms: 'not found'
        })
    })
    .catch(err => {
      res.status(200).json({
        err,
        rs: false
      })
    })
}

exports.change_user_info = (req, res, next) => {
  var { body, userData } = req
  User.findOneAndUpdate(
    { _id: userData.userId },
    { ...body }
  )
    .then(data => {
      res.status(200).json({
        success: true,
        result: {
          data: data,
          message: 'Update thanh cong!'
        }
      })
    })
    .catch(err => {
      res.status(400).json({
        success: false,
        result: {
          err: err,
          message: 'Update that bai!'
        }
      })
    })
}



exports.updateAvatar = async (req, res) => {
  var idUser = req.params.id;
  let path2 = "uploads/image/" + req.file.filename;

  const da = await User.findOne({ _id: idUser }).exec();

  if (path2 != da.avatar && (da.avatar != "uploads/image/people.png")) {
    fs.unlink(da.avatar, () => { })
    console.log(da.avatar);
  }

  const result = await User.findOne({ _id: idUser })
    .updateOne({ avatar: path2 })
    .catch(err => {
      res.status(500).json({
        success: false,
        result: {
          err,
          message: 'Upload avatar failed'
        }
      })
    });

  res.status(200).json({
    success: true,
    result: {
      pathCurrent: path2,
      docs: result
    }
  });

}

