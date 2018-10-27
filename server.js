const express = require('express')
const app = express()
const mongoose = require('mongoose')
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
const bodyParser = require('body-parser')
const passport = require('passport')


app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())




const port = process.env.PORT || 3000

const db = require('./config/keys').mogoURI
mongoose.connect(db).then(() => {
  console.log('数据库连接成功')
}).catch(err => {
  console.log(err)
})

app.use('/api/users', users)
app.use('/api/profiles', profiles)

// 配置passport
app.use(passport.initialize())
require('./config/passport')(passport)


app.listen(port, () => {
  console.log(`server running on ${port}`)
})