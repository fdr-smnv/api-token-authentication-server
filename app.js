const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')

const { PORT } = require('./helpers/envVariables')

mongoose.connect('mongodb://localhost/APIAuthentication', { useNewUrlParser: true })

const app = express()

// Middlewares

app.use(morgan('dev'))
app.use(express.json())

// Routes

app.use('/users', require('./routes/users'))

// Start the server 

app.listen(PORT, () => console.log(`Server listening at ${PORT}`))
