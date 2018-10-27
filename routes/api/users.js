// 用户登录和注册
const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const bcrypt = require('bcrypt') // 密码加密
const gravatar = require('gravatar') // 头像管理
const jwt = require('jsonwebtoken') // token管理
const keys = require('../../config/keys')
const passport = require('passport')

// 测试接口
router.get('/test', (req,res) => {
  res.json('success')
})

// 注册接口
router.post('/register', (req, res) => {
  // 查询数据库是否有这个用户
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json('邮箱已被占用')
    } else {
      const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'})
      const newUser = new User({
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        identity: req.body.identity,
        avatar
      })

      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          newUser.password = hash
          newUser.save().then((user) => {
            res.json(user)
          }).catch(err => {
            console.log(err)
          })
        })
      })
    }
  })
})

// 登录接口
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  User.findOne({
    email
  }).then(user => {
    if (!user) {
      return res.status(404).json('用户不存在')
    }
    //密码匹配
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        // 匹配成功
        // 发送token
        // 定义token规则
        const rule = {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          identity: user.identity
        }
        // jwt.sign('规则', '加密名字', '过期时间', '回调函数')
        jwt.sign(rule, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
          if (err) throw err
          res.json({
            success: true,
            token: 'Bearer ' + token
          })
        })
      } else {
        res.status(400).json('密码错误')
      }
    })
  })
})

// 用户拿到token请求信息
// 验证token
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity
  })
})

module.exports = router
