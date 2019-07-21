const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcryptjs')

// Create a schema

const userSchema = new Schema({
  method: {
    type: String,
    enum: ['local', 'google', 'facebook'],
    required: true
  },
  local: {
    email: {
      type: String,
      lowercase: true
    },
    password: {
      type: String,
    }
  },
  google: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
  facebook: {
    id: {
      type: String
    },
    email: {
      type: String,
      lowercase: true
    }
  },
})

// Hashing before saving

userSchema.pre('save', async function (next) {
  try {
    if (this.method !== 'local') {
      next()
    }
    // Generate a salt
    const salt = await bcrypt.genSalt(10)
    // Re-assign hashed password over original
    this.password = await bcrypt.hash(this.local.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

userSchema.methods.isValidPassword = async function (newPassword) {
  try {
    return await bcrypt.compare(newPassword, this.local.password)
  } catch (error) {
    throw new Error(error)
  }
}

// Create a model

const User = mongoose.model('user', userSchema)

module.exports = User