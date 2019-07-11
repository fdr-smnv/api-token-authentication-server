const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()

const app = express()

const { PORT = 3000 } = process.env

// Middlewares

app.use(morgan('dev'))
app.use(express.json())

// Routes

app.use('/users', require('./routes/users'))

// Start the server 

app.listen(PORT, () => console.log(`Server listening at ${PORT}`))
