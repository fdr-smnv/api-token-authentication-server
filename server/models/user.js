const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

// Create a schema

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

// Hashing before saving

userSchema.pre('save', async function (next) {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Re-assign hashed password over original
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (newPassword) {
  try{
    return await bcrypt.compare(newPassword, this.password)
  } catch(error) {
    throw new Error(error)
  }
}

// Create a model

const User = mongoose.model('user', userSchema)

module.exports = User