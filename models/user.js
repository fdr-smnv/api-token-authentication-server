const mongoose = require('mongoose')
const Schema = mongoose.Schema

// User Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
  }
})

// User model

const User = mongoose.model('user', userSchema)

module.exports = User