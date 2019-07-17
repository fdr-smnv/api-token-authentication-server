const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const { PORT } = require('./helpers/envVariables')


if (process.env.NODE_ENV === 'test') {
  mongoose.connect('mongodb://localhost/APIAuthenticationTEST', { useNewUrlParser: true })
} else {
  mongoose.connect('mongodb://localhost/APIAuthentication', { useNewUrlParser: true })
}

const app = express()

// Middlewares
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

app.use(express.json())

// Routes
app.use('/users', require('./routes/users'))


module.exports = app
