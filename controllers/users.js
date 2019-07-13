const JWT = require('jsonwebtoken')
const User = require('../models/user')

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

            // Respond with token

            const token = JWT.sign({
                iss: 'Issuer',
                sub: newUser.id,
                iat: new Date().getTime(), // current time
                exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
            }, 'secret')

            res.status(200).json({ token })

        } catch (error) {
            next(error)
        }
    },

    signIn: async (req, res, next) => {
        try {
            // Generate token
            console.log('UsersController.signIn called!')
            next()
        } catch (error) {
            next(error)
        }
    },

    secret: async (req, res, next) => {
        try {
            console.log('UsersController.secret called!')
            next()
        } catch (error) {
            next(error)
        }
    }
}