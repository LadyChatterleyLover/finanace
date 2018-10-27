const moogose = require('mongoose')
const Schema = moogose.Schema

const ProfileSchema = new Schema({
  date: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String
  },
  describe: {
    type: String
  },
  income: {
    type: String,
    required: true
  },
  expend: { // 支出
    type: String,
    required: true
  },
  cash: { // 现金
    type: String,
    required: true
  },
  remark: { // 备注
    type: String
  }
})

module.exports = Profile = moogose.model('profile', ProfileSchema)

