const passport = require('passport')
const { JwtStrategy, ExtractJwt } = require('passport-jwt')

const { User } = require('./models/user')
const { JWT_SECRET } = require('./helpers/envVariables')

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

  } catch (errIor) {
    done(error, false)
  }
}))

