const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy

const User = require('./models/user')
const { JWT_SECRET } = require('./helpers/envVariables')


// JWT STRATEGY

passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    // Find the user specified in token

    const user = await User.findById(payload.sub)

    // If user doesn't exist, handle it

    if (!user) {
      return done(null, false)
    }

    // Otherwise, return the user

    done(null, user)

  } catch (error) {
    done(error, false)
  }
}))

// LOCAL STRATEGY

passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    const user = await User.findOne({ email })

    if (!user) {
      return done(null, false)
    }

    if (password !== user.password) {
      return done(null, false)
    } else {
      return done(null, user)
    }
  } catch (error) {

  }
}))