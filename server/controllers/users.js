const JWT = require('jsonwebtoken')

const User = require('../models/user')
const { JWT_SECRET, JWT_ISSUER } = require('../helpers/envVariables')

const signUser = user => {
  return JWT.sign({
    iss: JWT_ISSUER,
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET)
}

module.exports = {
  signUp: async (req, res, next) => {
    try {
      const { email, password } = req.value.body

      // Check if there is a user with the same email
      const foundUser = await User.findOne({ email })
      if (foundUser) {
        return res.status(403).json({ error: 'Email is already in use' })
      }

      // Create a new user
      const newUser = new User({ email, password })
      await newUser.save()

      // Generate token
      const token = signUser(newUser)

      // Respond with token
      res.status(200).json({ token })

    } catch (error) {
      next(error)
    }
  },

  signIn: async (req, res, next) => {
    try {
      // Generate token
      const token = signUser(req.user)
      res.status(200).json({ token })
    } catch (error) {
      next(error)
    }
  },

  secret: async (req, res, next) => {
    try {
      res.send('Authorized')
    } catch (error) {
      next(error)
    }
  }
}