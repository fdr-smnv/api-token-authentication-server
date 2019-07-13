require('dotenv').config()

const {
  PORT = 3000,
  JWT_SECRET = 'secret',
  JWT_ISSUER = 'issuer'
} = process.env

module.exports = {
  PORT,
  JWT_SECRET,
  JWT_ISSUER
}