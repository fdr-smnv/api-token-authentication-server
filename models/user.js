const mongoose = require('mongoose')
const Schema = mongoose.Schema

// User Schema

const userSchema = new Schema({
    email: String,
    password: String
})

// User model

const User = mongoose.model('user', userSchema)

module.exports = User