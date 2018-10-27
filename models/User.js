const moogose = require('mongoose')
const Schema = moogose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  // 身份字段
  identity: {
    type: String,
    required: true
  }
})

module.exports = User = moogose.model('user', UserSchema)
