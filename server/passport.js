const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const { ExtractJwt } = require('passport-jwt')
const LocalStrategy = require('passport-local').Strategy
const GooglePlusTokenStrategy = require('passport-google-plus-token')

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

// GOOGLE OAUTH STRATEGY
passport.use('googleToken', new GooglePlusTokenStrategy({
  clientID: '594652903364-uifok1arnekjbdgi15fsmvlng0ta2s79.apps.googleusercontent.com',
  clientSecret: '1ZmvQYwh5ZQVjQsiQ-fwGui3'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('accessToken', accessToken, '\n')
    console.log('refreshToken', refreshToken)
    console.log('profile', profile)

    // Check whether this current user exists in out db
    // If it exists, return this user
    const existingUser = await User.findOne({ 'google.id': profile.id })

    if (existingUser) {
      return done(null, existingUser)
    }

    // If account is new
    const newUser = new User({
      method: 'google',
      google: {
        id: profile.id,
        email: profile.emails[0].value
      }
    })

    await newUser.save()
    done(null, newUser)
  } catch (error) {
    done(error, false, error.message)
  }
}))

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user given the email
    const user = await User.findOne({ email })

    // If not, handle it
    if (!user) {
      return done(null, false)
    }

    // Check if password is correct
    const isMatch = await user.isValidPassword(password)

    // If not, handle it
    if (!isMatch) {
      return done(null, false)
    }

    // Otherwise, return the user
    done(null, user)

  } catch (error) {
    done(error, false)
  }
}))